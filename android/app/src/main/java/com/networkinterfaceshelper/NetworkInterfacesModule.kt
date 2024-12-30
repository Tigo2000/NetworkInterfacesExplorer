package com.networkinterfacesexplorer

import android.content.Context
import android.net.wifi.WifiManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import org.json.JSONArray
import org.json.JSONObject
import java.net.InetAddress
import java.net.NetworkInterface
import java.util.Collections

class NetworkInterfacesModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NetworkInterfacesModule"
    }

    @ReactMethod
    fun getNetworkInterfaces(promise: Promise) {
        try {
            val interfacesJson = JSONArray()

            val interfaces = Collections.list(NetworkInterface.getNetworkInterfaces())
            for (intf in interfaces) {
                val intfJson = JSONObject()
                intfJson.put("name", intf.name)

                val addressesJson = JSONArray()
                val addresses = Collections.list(intf.inetAddresses)
                for (addr in addresses) {
                    if (!addr.isLoopbackAddress) {
                        val addressJson = JSONObject()
                        addressJson.put("address", addr.hostAddress)
                        addressJson.put("isIPv4", addr is InetAddress && addr.hostAddress.indexOf(':') < 0)
                        addressJson.put("isIPv6", addr is InetAddress && addr.hostAddress.indexOf(':') >= 0)
                        addressesJson.put(addressJson)
                    }
                }

                intfJson.put("addresses", addressesJson)
                interfacesJson.put(intfJson)
            }

            val result = JSONObject()
            result.put("interfaces", interfacesJson)

            promise.resolve(result.toString())
        } catch (e: Exception) {
            Log.e("NetworkInterfacesModule", "Error fetching network interfaces", e)
            promise.reject("Error", "Failed to fetch network interfaces: ${e.localizedMessage}")
        }
    }
}
