package com.safedish;

import android.app.Application;
import android.content.Context;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.app.Activity;
import android.provider.Settings;
import androidx.appcompat.app.AppCompatActivity;

public class PermissionManager{

    private static final int REQUEST_OVERLAY_PERMISSION = 1234;
    private Activity activity;

    PermissionManager(Activity activity){
        this.activity = activity;
    }

    public void showPermissionDialog(String Mode){
        if(Mode == "Overlay"){
            showOverlayPermissionDialog();
        }
    }

    /**
     * 다른 앱 그리기 권한 설정창 이동.
     */
    private void showOverlayPermissionDialog(){
        new AlertDialog.Builder(activity)
                .setTitle("권한 요청")
                .setMessage("SafeDish는 다른 앱 위에 그리기 권한을 필요로 합니다. \n권한 설정창으로 이동하시겠습니까?")
                .setCancelable(true)
                .setNegativeButton("취소", new DialogInterface.OnClickListener(){
                    public void onClick(DialogInterface dialog, int which){
                        dialog.dismiss();
                    }
                })
                .setPositiveButton("확인", new DialogInterface.OnClickListener(){
                    public void onClick(DialogInterface dialog, int which){
                        Intent intent = new Intent(
                                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                Uri.parse("package:" + activity.getPackageName())
                        );
                        activity.startActivityForResult(intent, REQUEST_OVERLAY_PERMISSION);
                    }
                })
                .show();
    }

}