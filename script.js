
document.addEventListener('DOMContentLoaded', function() {
    const getUdidBtn = document.getElementById('getUdidBtn');
    const resultSection = document.getElementById('result');
    const udidValue = document.getElementById('udidValue');
    const copyBtn = document.getElementById('copyBtn');

    // Check if UDID is already in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const udid = urlParams.get('udid');
    
    if (udid) {
        showResult(udid);
    }

    getUdidBtn.addEventListener('click', function() {
        generateMobileConfig();
    });

    copyBtn.addEventListener('click', function() {
        udidValue.select();
        udidValue.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            copyBtn.textContent = '✅ Đã sao chép!';
            copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                copyBtn.textContent = '📋 Sao chép';
                copyBtn.style.background = '#28a745';
            }, 2000);
        } catch (err) {
            // Fallback for newer browsers
            navigator.clipboard.writeText(udidValue.value).then(() => {
                copyBtn.textContent = '✅ Đã sao chép!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Sao chép';
                }, 2000);
            });
        }
    });

    function generateMobileConfig() {
        const currentUrl = window.location.origin + window.location.pathname;
        
        const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDescription</key>
            <string>Cấu hình để lấy UDID thiết bị</string>
            <key>PayloadDisplayName</key>
            <string>UDID Detector</string>
            <key>PayloadIdentifier</key>
            <string>com.udiddetector.profile</string>
            <key>PayloadType</key>
            <string>Profile Service</string>
            <key>PayloadUUID</key>
            <string>${generateUUID()}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadContent</key>
            <dict>
                <key>URL</key>
                <string>${currentUrl}?udid=%UDID%&devicename=%DEVICE_NAME%&model=%PRODUCT%&version=%VERSION%</string>
                <key>DeviceAttributes</key>
                <array>
                    <string>UDID</string>
                    <string>DEVICE_NAME</string>
                    <string>PRODUCT</string>
                    <string>VERSION</string>
                </array>
            </dict>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Profile để lấy thông tin UDID thiết bị iOS</string>
    <key>PayloadDisplayName</key>
    <string>UDID Detector</string>
    <key>PayloadIdentifier</key>
    <string>com.udiddetector.profile.main</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${generateUUID()}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

        // Create and download the .mobileconfig file
        const blob = new Blob([mobileConfig], { type: 'application/x-apple-aspen-config' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'udid_detector.mobileconfig';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Show instructions
        alert('File cấu hình đã được tải xuống! Vui lòng mở file và cài đặt theo hướng dẫn.');
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function showResult(udid) {
        udidValue.value = udid;
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update page title
        document.title = 'UDID: ' + udid;
    }

    // Handle iOS device information from URL parameters
    const deviceName = urlParams.get('devicename');
    const model = urlParams.get('model');
    const version = urlParams.get('version');
    
    if (deviceName || model || version) {
        let deviceInfo = '';
        if (deviceName) deviceInfo += `Tên thiết bị: ${decodeURIComponent(deviceName)}\n`;
        if (model) deviceInfo += `Model: ${decodeURIComponent(model)}\n`;
        if (version) deviceInfo += `Phiên bản iOS: ${decodeURIComponent(version)}\n`;
        
        if (deviceInfo) {
            console.log('Thông tin thiết bị:', deviceInfo);
        }
    }
});
