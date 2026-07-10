const fs = require('fs');
const path = require('path');

const detailPath = path.join(__dirname, 'fitempire-mobile', 'src', 'app', 'gym-detail.tsx');
let detailContent = fs.readFileSync(detailPath, 'utf8');

// Replace handlePurchase if it exists, or inject it
const purchaseLogic = `
  const handlePurchase = async (plan: any) => {
    try {
      Alert.alert("Initializing Checkout", "Contacting Razorpay...");
      
      // 1. Create Order Backend
      const orderRes = await fetch('http://localhost:8080/api/v1/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: '11111111-1111-1111-1111-111111111111',
          amount: plan.price
        })
      });
      const orderData = await orderRes.json();
      const orderId = orderData.data;

      // 2. Simulate Razorpay UI (Since native module isn't linked)
      setTimeout(async () => {
        Alert.alert("Razorpay Success", "Payment captured. Verifying signature on server...");
        
        // 3. Verify Payment Backend
        const verifyRes = await fetch('http://localhost:8080/api/v1/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderId,
            razorpay_payment_id: "pay_mock_" + Math.floor(Math.random()*10000),
            razorpay_signature: "mock_signature_string",
            internal_payment_id: '11111111-1111-1111-1111-111111111111'
          })
        });
        const verifyData = await verifyRes.json();
        if(verifyData.success) {
            Alert.alert("Success!", "Membership Purchased Successfully!");
        } else {
            Alert.alert("Error", "Payment verification failed.");
        }
      }, 1500);

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not complete purchase.");
    }
  };
`;

if (!detailContent.includes('const handlePurchase')) {
    detailContent = detailContent.replace(
        'if (loading) {',
        purchaseLogic + '\n  if (loading) {'
    );
    // Bind handlePurchase to the purchase button
    detailContent = detailContent.replace(
        /TouchableOpacity style=\{styles\.planButton\}/g,
        'TouchableOpacity onPress={() => handlePurchase(plan)} style={styles.planButton}'
    );
    fs.writeFileSync(detailPath, detailContent);
    console.log("Updated gym-detail.tsx with Razorpay checkout flow");
} else {
    console.log("gym-detail.tsx already has handlePurchase");
}
