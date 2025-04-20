package com.brainbuzz.database

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import java.util.concurrent.Executors

class DatabaseModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val executorService = Executors.newFixedThreadPool(4)
    private val database = AppDatabase.getInstance(reactContext)

    override fun getName() = "DatabaseModule"

    @ReactMethod
    fun addUser(userMap: ReadableMap, promise: Promise) {
        executorService.execute {
            try {
                val user = User(
                    name = userMap.getString("name") ?: "",
                    email = userMap.getString("email") ?: ""
                )
                
                val id = database.userDao().insert(user)
                promise.resolve(id.toInt())
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error adding user", e)
                promise.reject("DB_ERROR", "Error adding user: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun getUsers(promise: Promise) {
        executorService.execute {
            try {
                val users = database.userDao().getAll()
                val resultArray = WritableNativeArray()
                
                for (user in users) {
                    val userMap = WritableNativeMap()
                    userMap.putInt("id", user.id)
                    userMap.putString("name", user.name)
                    userMap.putString("email", user.email)
                    resultArray.pushMap(userMap)
                }
                
                promise.resolve(resultArray)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error getting users", e)
                promise.reject("DB_ERROR", "Error getting users: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun getUserById(userId: Int, promise: Promise) {
        executorService.execute {
            try {
                val user = database.userDao().getById(userId)
                if (user == null) {
                    promise.resolve(null)
                    return@execute
                }
                
                val userMap = WritableNativeMap()
                userMap.putInt("id", user.id)
                userMap.putString("name", user.name)
                userMap.putString("email", user.email)
                
                promise.resolve(userMap)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error getting user by ID", e)
                promise.reject("DB_ERROR", "Error getting user by ID: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun updateUser(userMap: ReadableMap, promise: Promise) {
        executorService.execute {
            try {
                val user = User(
                    id = userMap.getInt("id"),
                    name = userMap.getString("name") ?: "",
                    email = userMap.getString("email") ?: ""
                )
                
                database.userDao().update(user)
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error updating user", e)
                promise.reject("DB_ERROR", "Error updating user: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun deleteUser(userId: Int, promise: Promise) {
        executorService.execute {
            try {
                val user = User(id = userId, name = "", email = "")
                database.userDao().delete(user)
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error deleting user", e)
                promise.reject("DB_ERROR", "Error deleting user: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun deleteAllUsers(promise: Promise) {
        executorService.execute {
            try {
                database.userDao().deleteAll()
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error deleting all users", e)
                promise.reject("DB_ERROR", "Error deleting all users: ${e.message}")
            }
        }
    }
}