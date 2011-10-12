package com.csbctech.skipre;

import com.phonegap.*;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.PowerManager;
import android.view.Display;
import android.view.WindowManager;
import android.webkit.WebSettings.RenderPriority;

public class Android_SkiPreActivity extends DroidGap {
	// protected float ORIG_APP_W = 480;
	protected float ORIG_APP_H = 480;
	protected PowerManager.WakeLock mWakeLock;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		getWindow().setFlags(
				WindowManager.LayoutParams.FLAG_FULLSCREEN,
				WindowManager.LayoutParams.FLAG_FULLSCREEN
						| WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);

		super.loadUrl("file:///android_asset/www/index.html");

		// set some defaults
		this.appView.setBackgroundColor(0x000000);
		this.appView.setHorizontalScrollBarEnabled(false);
		this.appView.setHorizontalScrollbarOverlay(false);
		this.appView.setVerticalScrollBarEnabled(false);
		this.appView.setVerticalScrollbarOverlay(false);

		// get actual screen size
		Display display = ((WindowManager) getSystemService(Context.WINDOW_SERVICE))
				.getDefaultDisplay();
		// int width = display.getWidth();
		int height = display.getHeight();

		// calculate target scale (only dealing with landscape)
		double globalScale = Math.ceil((height / ORIG_APP_H) * 100);

		// set some defaults to the web view
		this.appView.getSettings().setBuiltInZoomControls(false);
		this.appView.getSettings().setSupportZoom(false);
		this.appView.getSettings().setGeolocationEnabled(true);
		this.appView.getSettings().setLightTouchEnabled(true);
		this.appView.getSettings().setRenderPriority(RenderPriority.HIGH);

		// set the scale
		int scale = (int) globalScale;
		scale -= 5;
		this.appView.setInitialScale(scale);

		final PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
		this.mWakeLock = pm.newWakeLock(PowerManager.SCREEN_BRIGHT_WAKE_LOCK,
				"asw");
		this.mWakeLock.acquire();
	}

	@Override
	public void onDestroy() {
		this.mWakeLock.release();
		super.onDestroy();
	}

	public boolean isOnline() {
		ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo netInfo = cm.getActiveNetworkInfo();
		if (netInfo != null && netInfo.isConnectedOrConnecting()) {
			return true;
		}
		return false;
	}
}