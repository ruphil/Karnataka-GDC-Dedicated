package com.rdhinc.kgdcattendance;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      checkGPSStatus();
    }});
  }

  private void checkGPSStatus() {
    Context context = this;

    LocationManager lm = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);
    boolean gps_enabled = false;
    boolean network_enabled = false;

    try {
      gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
    } catch(Exception ex) {}

    try {
      network_enabled = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    } catch(Exception ex) {}

    if(!gps_enabled && !network_enabled) {
      // notify user
      AlertDialog.Builder alert = new AlertDialog.Builder(context);
      alert.setMessage("GPS is turned off.");
      alert.setPositiveButton("GPS is turned Off. Turn On GPS.", new DialogInterface.OnClickListener() {
        @Override
        public void onClick(DialogInterface paramDialogInterface, int paramInt) {
          context.startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
        }
      });
      alert.setCancelable(false);
      alert.show();
    }
  }
}


