---

## 11. Concurrency Control, Race Conditions & Distributed Locking

High-concurrency distributed applications suffer catastrophic failures if race conditions are ignored. FitEmpire explicitly models and mitigates four core race condition scenarios:

### 11.1 Class Slot Overbooking Defense (Pessimistic vs Optimistic Locking)

#### The Race Scenario:
A popular HIIT class in Koramangala has **1 remaining slot**. Two members (User A and User B) tap "Confirm Booking" at the exact same millisecond:
- **Thread 1:** Reads `availableSlots = 1`.
- **Thread 2:** Reads `availableSlots = 1`.
- **Thread 1:** Decrements to `0`, saves booking.
- **Thread 2:** Decrements to `0`, saves booking.
- **Result:** 2 users booked for 1 slot. Studio is overbooked; the gym turns away a furious customer at the door.

#### Architectural Mitigation:
We evaluated both locking paradigms:
1. **Optimistic Locking (`@Version`):** Fails Thread 2 with an `OptimisticLockException`. Under high contention (e.g. 50 users vying for 2 cancellation slots), 48 users experience failed transactions and frustrating retries.
2. **Pessimistic Write Locking (`SELECT ... FOR UPDATE`):**
   ```sql
   SELECT * FROM class_schedules WHERE id = ? FOR UPDATE;
   ```
   Thread 1 acquires a row-level exclusive lock. Thread 2 pauses and queues behind Thread 1. When Thread 1 decrements the slot to `0` and commits, Thread 2 acquires the lock, reads `availableSlots = 0`, and cleanly returns a polite "Class Full" response without throwing unexpected runtime exceptions.
- **Decision:** FitEmpire utilizes **Pessimistic Row Locking** for class slot deductions.

---

### 11.2 Wallet Balance Deduction & Double-Spend Mitigation

#### The Race Scenario:
A member has ₹500 in their digital FitEmpire wallet. They simultaneously attempt:
- Request 1: Book personal trainer session (cost ₹400).
- Request 2: Buy protein shake at gym bar via QR scan (cost ₹300).
If both threads execute `balance = balance - cost` without locking, both deduct from ₹500, resulting in ₹700 worth of services consumed against an initial ₹500 balance (negative balance or ₹100 uncollected debt).

#### Architectural Mitigation:
1. **Database Row Lock on Wallet:**
   ```sql
   SELECT balance FROM wallets WHERE user_id = ? FOR UPDATE;
   ```
2. **Database Check Constraint:**
   ```sql
   ALTER TABLE wallets ADD CONSTRAINT chk_wallet_non_negative CHECK (balance >= 0.00);
   ```
   Even if application logic fails, the database engine physically rejects any transaction resulting in `balance < 0.00`.
3. **Double-Entry Ledger Audit:**
   Every debit writes a corresponding record to `wallet_ledger`. If the sum of ledger transactions does not equal `wallets.balance`, an automated nightly reconciliation cron flags the user account.

---

### 11.3 Turnstile QR Replay Attack Defense

#### The Race Scenario:
Member A generates a dynamic QR code on their phone, screenshots it, and sends it via WhatsApp to Member B standing right behind them in line. Member A scans and passes the barrier; Member B immediately presents the screenshot to the scanner.

#### Architectural Mitigation:
1. **Cryptographic Ephemeral Nonce:** The QR payload embeds a random UUID nonce.
2. **Single-Use Atomic Redis `GETDEL`:**
   ```java
   String cached = redisTemplate.opsForValue().getAndDelete("qr_nonce:" + nonce);
   ```
   When Member A scans, Redis retrieves the key and physically deletes it in the **same CPU cycle**.
3. When Member B scans 3 seconds later, Redis returns `null`. The backend rejects the check-in instantly with `"QR code already consumed"`.
4. **Time-To-Live Hard Limit:** Keys auto-destruct in Redis after 60 seconds. Even if unscheduled, a screenshot is completely useless after 1 minute.

---

### 11.4 Pass Freeze Simultaneous Check-in Race Condition

#### The Race Scenario:
A user initiates a pass freeze starting today to pause their subscription billing, while simultaneously scanning into a gym.

#### Architectural Mitigation:
The check-in service and pass-freeze service acquire a distributed lock keyed on the user's membership ID:
```text
lock:membership:{membershipId}
```
Using Redisson / Redis distributed locking, whichever transaction commits first invalidates the other. If the freeze commits first, the check-in is rejected with `MEMBERSHIP_FROZEN`. If the check-in commits first, the pass freeze start date is automatically shifted to tomorrow.
