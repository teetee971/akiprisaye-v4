# Android Release Keystore Guide

## Overview

This guide explains how to generate and manage the Android release keystore for **A KI PRI SA YÉ** app. The keystore is required for signing your Android app before uploading to Google Play Store.

## ⚠️ Critical Information

### Keystore Security Rules

1. **NEVER** commit keystore files to version control (Git)
2. **ALWAYS** keep multiple secure backups of your keystore
3. **NEVER** share your keystore password
4. **NEVER** lose your keystore - you cannot update your app without it!

### What is a Keystore?

A keystore is a binary file that contains your app's private key. Google Play uses this to verify that app updates come from you (the original developer). If you lose your keystore:
- You cannot update your existing app
- You must publish as a completely new app
- Users cannot upgrade; they must uninstall and reinstall

## Generating the Release Keystore

### Prerequisites

- Java JDK installed (required for `keytool` command)
- Terminal/Command line access

### Step 1: Navigate to Android Directory

```bash
cd android
```

### Step 2: Run the Generation Script

We provide a convenient script that runs the exact command from the specification:

```bash
./generate-release-keystore.sh
```

This script will:
1. Check if a keystore already exists (prevents accidental overwrite)
2. Run the keytool command with the correct parameters
3. Prompt you for required information

### Step 3: Provide Information

The keytool will prompt you for:

1. **Keystore password**: Choose a strong password (min 6 characters)
   - Example: Use a password manager to generate a strong password
   - Store this password securely!

2. **Key password**: Can be the same as keystore password (press Enter)

3. **Certificate information**:
   - **First and last name**: Your name or organization name
   - **Organizational unit**: Your team/department (e.g., "Development")
   - **Organization**: Your organization name (e.g., "A KI PRI SA YÉ")
   - **City**: Your city
   - **State/Province**: Your state or province
   - **Country code**: Two-letter country code (e.g., "FR" for France, "GP" for Guadeloupe)

Example:
```
What is your first and last name?
  [Unknown]:  A KI PRI SA YÉ Team
What is the name of your organizational unit?
  [Unknown]:  Development
What is the name of your organization?
  [Unknown]:  A KI PRI SA YÉ
What is the name of your City or Locality?
  [Unknown]:  Fort-de-France
What is the name of your State or Province?
  [Unknown]:  Martinique
What is the two-letter country code for this unit?
  [Unknown]:  MQ
Is CN=A KI PRI SA YÉ Team, OU=Development, O=A KI PRI SA YÉ, L=Fort-de-France, ST=Martinique, C=MQ correct?
  [no]:  yes
```

### Manual Generation (Alternative)

If you prefer to run the command manually:

```bash
keytool -genkeypair \
  -keystore release.jks \
  -alias release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Parameters Explained:**
- `-keystore release.jks`: Output file name
- `-alias release`: Key alias (identifier)
- `-keyalg RSA`: Use RSA algorithm
- `-keysize 2048`: 2048-bit key (secure standard)
- `-validity 10000`: Valid for 10,000 days (~27 years)

## Keystore Information

After generation, your keystore will have:

- **File**: `release.jks`
- **Location**: `android/release.jks`
- **Alias**: `release`
- **Algorithm**: RSA
- **Key Size**: 2048 bits
- **Validity**: 10,000 days (~27 years from creation date)

## Securing Your Keystore

### Storage Best Practices

1. **Primary Storage**:
   - Store in a secure location outside the repository
   - Consider a dedicated "credentials" folder with restricted access

2. **Backup Strategy** (Choose multiple):
   - Encrypted cloud storage (e.g., password-protected cloud drive)
   - Encrypted USB drive in secure physical location
   - Password manager's secure document storage
   - Company secure credentials vault

3. **Password Management**:
   - Store passwords in a secure password manager (LastPass, 1Password, Bitwarden, etc.)
   - Never store passwords in plain text files
   - Document which password manager contains the credentials

### Documentation to Keep

Create a secure document with:
```
App: A KI PRI SA YÉ Android App
Keystore File: release.jks
Keystore Password: [stored in password manager]
Key Alias: release
Key Password: [stored in password manager]
Creation Date: [YYYY-MM-DD]
Expiry Date: [YYYY-MM-DD] (~27 years from creation)
Certificate DN: [Your certificate distinguished name]
Backup Locations: [List your backup locations]
```

## Configuring Android Build

### Option 1: Local Signing (Development/Testing)

If you want to sign locally during development, update `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('release.jks')
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: ''
            keyAlias 'release'
            keyPassword System.getenv("KEY_PASSWORD") ?: ''
        }
    }
    
    buildTypes {
        release {
            debuggable false
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

Set environment variables before building:
```bash
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_PASSWORD="your_key_password"
./gradlew bundleRelease
```

### Option 2: Google Play App Signing (Recommended)

**A KI PRI SA YÉ currently uses Google Play App Signing**, which means:

1. You sign the initial upload with your upload key (this keystore)
2. Google Play re-signs with their own production key
3. This provides additional security and allows Google to optimize APKs

**For Google Play App Signing:**
- You still need this keystore for the initial upload
- Google manages the production signing key
- You can reset your upload key if compromised (production key is safe)

The current build configuration is compatible with Google Play App Signing.

## Verifying Your Keystore

To view keystore information:

```bash
keytool -list -v -keystore release.jks -alias release
```

To view certificate:

```bash
keytool -list -v -keystore release.jks
```

## Troubleshooting

### "keytool: command not found"

**Solution**: Install Java JDK
```bash
# Ubuntu/Debian
sudo apt-get install default-jdk

# macOS (with Homebrew)
brew install openjdk

# Windows
# Download and install JDK from Oracle or Adoptium
```

### "Keystore was tampered with, or password was incorrect"

**Solution**: 
- Verify you're using the correct password
- Ensure keystore file hasn't been corrupted
- Restore from backup if necessary

### "Cannot recover key"

**Solution**:
- Ensure key password matches keystore password (if you set them the same)
- Check for typos in password

### Lost Keystore or Password

**This is a critical situation:**
1. Check all backup locations immediately
2. Check password manager
3. If truly lost:
   - For existing published app: Contact Google Play support
   - They may allow account verification to reset upload key
   - Production key managed by Google is NOT lost
4. Prevention: Follow backup best practices above

## Building Signed APK/AAB

### Using Gradle Command Line

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Using Android Studio

1. Open project in Android Studio
2. Menu: **Build** → **Generate Signed Bundle / APK**
3. Select **Android App Bundle** (recommended) or **APK**
4. Click **Next**
5. Choose existing keystore: `release.jks`
6. Enter passwords
7. Select **release** build variant
8. Click **Finish**

## CI/CD Configuration

For GitHub Actions or CI/CD pipelines:

1. **DO NOT** commit keystore to repository
2. Store keystore as base64-encoded secret:

```bash
# Encode keystore
base64 release.jks > release.jks.base64

# In GitHub: Settings → Secrets → New repository secret
# Name: KEYSTORE_BASE64
# Value: [paste content of release.jks.base64]

# Also add secrets for:
# KEYSTORE_PASSWORD
# KEY_PASSWORD
```

3. Decode in workflow:

```yaml
- name: Decode keystore
  run: |
    echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > android/release.jks && \
    test -f android/release.jks || { echo "Failed to decode keystore"; exit 1; }

- name: Build signed AAB
  env:
    KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
    KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
  run: |
    cd android
    ./gradlew bundleRelease
```

## Keystore Rotation

If you need to change your keystore (security incident, expiry):

### With Google Play App Signing (Current Setup)

1. Generate new keystore using this guide
2. Sign new AAB with new keystore
3. Upload to Google Play Console
4. Google Play Console → Release → Setup → App integrity
5. Request new upload key

Google will verify your account and accept the new upload key. Your production key remains unchanged, so users can still update the app.

### Without Google Play App Signing

You cannot change the keystore. Apps signed with different keys are considered different apps.

## Summary Checklist

After generating keystore:

- [ ] Keystore file created (`release.jks`)
- [ ] Keystore verified with `keytool -list`
- [ ] Password stored in secure password manager
- [ ] At least 2 secure backups created
- [ ] Backup locations documented
- [ ] `.gitignore` configured (already done in this project)
- [ ] Team members informed about keystore location (if applicable)
- [ ] Build tested with new keystore
- [ ] CI/CD secrets configured (if applicable)

## Support

For keystore-related issues:
- Android Keystore Documentation: https://developer.android.com/studio/publish/app-signing
- Google Play App Signing: https://support.google.com/googleplay/android-developer/answer/9842756

For project-specific questions, see `ANDROID_SETUP.md`.

## Security Reminders

🔒 **The keystore is the key to your app's identity. Treat it like a password.**

- ✅ Back up securely
- ✅ Store passwords in password manager
- ✅ Restrict access to authorized team members only
- ❌ Never commit to version control
- ❌ Never share via email or messaging
- ❌ Never store in unencrypted cloud storage
