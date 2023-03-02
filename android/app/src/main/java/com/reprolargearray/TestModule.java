package com.reprolargearray;
import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.ReadableArray;

import java.io.InputStream;

public class TestModule extends ReactContextBaseJavaModule {

    TestModule(ReactApplicationContext context) {
       super(context);
   }

    @Override
    public String getName() {
        return "TestModule";
    }

    @ReactMethod
    public void test(ReadableArray arr, Promise promise) {
        promise.resolve(null);
    }
}
