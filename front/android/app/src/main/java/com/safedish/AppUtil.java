package com.safedish;

import android.app.Activity;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
public class AppUtil extends ReactContextBaseJavaModule{
    private ReactApplicationContext _reactContext;
    public AppUtil(ReactApplicationContext reactContext){
        super(reactContext);
        this._reactContext = reactContext;
    } // 할당

    public ReactApplicationContext getReactContext() {
        return _reactContext;
    }
    @Override
    public String getName(){
        return "AppUtil";
    }
    @ReactMethod
    public void toBack(){
        Log.d("MainAct", "Apputil::toMain() -> callback to Background");
        _toBack();
    }

    @ReactMethod
    public void toApp(){
        _toApp();
    }



    private void _toBack(){
        Activity activity = getCurrentActivity();
        if(activity != null){
            activity.moveTaskToBack(true);
        }
    }

    private int _toApp(){
        return 1;
    }

}