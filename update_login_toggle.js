const fs = require('fs');
const path = require('path');

const loginPath = path.join(__dirname, 'fitempire-mobile', 'src', 'app', 'login.tsx');
let loginContent = fs.readFileSync(loginPath, 'utf8');

// 1. Add loginMode state
if (!loginContent.includes('const [loginMode, setLoginMode] = useState')) {
    loginContent = loginContent.replace(
        'const [step, setStep] = useState<1 | 2>(1);',
        'const [step, setStep] = useState<1 | 2>(1);\n  const [loginMode, setLoginMode] = useState<\'USER\' | \'PARTNER\'>(\'USER\');'
    );
    console.log("Added loginMode state");
}

// 2. Add Role Toggle UI
if (!loginContent.includes('Role Toggle')) {
    const roleToggleUI = `
            {/* Role Toggle */}
            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 4, marginBottom: 24, alignSelf: 'stretch' }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: loginMode === 'USER' ? '#6C63FF' : 'transparent', alignItems: 'center' }}
                onPress={() => setLoginMode('USER')}
              >
                <ThemedText style={{ color: '#fff', fontWeight: loginMode === 'USER' ? 'bold' : '600' }}>Member</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: loginMode === 'PARTNER' ? '#6C63FF' : 'transparent', alignItems: 'center' }}
                onPress={() => setLoginMode('PARTNER')}
              >
                <ThemedText style={{ color: '#fff', fontWeight: loginMode === 'PARTNER' ? 'bold' : '600' }}>Gym Partner</ThemedText>
              </TouchableOpacity>
            </View>
    `;
    
    // Inject right above "Enter your mobile number"
    loginContent = loginContent.replace(
        '<ThemedText style={styles.subtitle}>Enter your mobile number to continue</ThemedText>',
        '<ThemedText style={styles.subtitle}>{loginMode === \'PARTNER\' ? \'Partner Login (Restricted Access)\' : \'Enter your mobile number to continue\'}</ThemedText>'
    );

    loginContent = loginContent.replace(
        '{/* Input Section */}',
        roleToggleUI + '\n            {/* Input Section */}'
    );
    console.log("Added Role Toggle UI");
}

// 3. Hide Sign Up text in Partner mode
if (!loginContent.includes('{loginMode === \'USER\' && (')) {
    loginContent = loginContent.replace(
        '<ThemedText style={styles.footerText}>',
        '{loginMode === \'USER\' && (\n              <ThemedText style={styles.footerText}>'
    );
    loginContent = loginContent.replace(
        '</ThemedText>',
        '</ThemedText>\n            )}'
    );
    console.log("Disabled sign up in Partner mode");
}

fs.writeFileSync(loginPath, loginContent);
console.log("Updated login.tsx successfully");
