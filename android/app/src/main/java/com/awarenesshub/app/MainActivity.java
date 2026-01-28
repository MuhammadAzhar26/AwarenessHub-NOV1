package com.awarenesshub.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Force desktop mode - show full website like on desktop
        WebSettings webSettings = this.bridge.getWebView().getSettings();
        
        // Enable zoom but start with desktop view
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        
        // DESKTOP MODE: Show full width desktop site
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);
        
        // Set initial zoom to show full desktop (will be controlled by viewport meta tag)
        webSettings.setTextZoom(100);
        
        // Desktop user agent (optional - makes site think it's desktop)
        String desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        webSettings.setUserAgentString(desktopUA);
    }
}
