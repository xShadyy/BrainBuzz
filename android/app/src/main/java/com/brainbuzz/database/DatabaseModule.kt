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
import java.util.Date

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
                    email = userMap.getString("email") ?: "",
                    password = userMap.getString("password") ?: "",
                    creationDate = System.currentTimeMillis()
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
    fun registerUser(userMap: ReadableMap, promise: Promise) {
        executorService.execute {
            try {
                val email = userMap.getString("email") ?: ""
                
                // Check if email is already taken
                val isEmailTaken = database.userDao().isEmailTaken(email)
                if (isEmailTaken) {
                    promise.reject("EMAIL_TAKEN", "This email is already registered")
                    return@execute
                }
                
                val user = User(
                    name = userMap.getString("name") ?: "",
                    email = email,
                    password = userMap.getString("password") ?: "",
                    creationDate = System.currentTimeMillis()
                )
                
                val id = database.userDao().insert(user)
                  val resultMap = WritableNativeMap()
                resultMap.putInt("id", id.toInt())
                resultMap.putString("name", user.name)
                resultMap.putString("email", user.email)
                resultMap.putDouble("creationDate", user.creationDate.toDouble())
                resultMap.putInt("xp", user.xp)
                resultMap.putInt("level", user.level)
                
                promise.resolve(resultMap)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error registering user", e)
                promise.reject("DB_ERROR", "Error registering user: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun loginUser(email: String, password: String, promise: Promise) {        executorService.execute {
            try {
                val user = database.userDao().login(email, password)
                if (user == null) {
                    promise.reject("AUTH_FAILED", "Invalid email or password")
                    return@execute
                }
                
                val userMap = WritableNativeMap()
                userMap.putInt("id", user.id)
                userMap.putString("name", user.name)
                userMap.putString("email", user.email)
                userMap.putDouble("creationDate", user.creationDate.toDouble())
                userMap.putInt("xp", user.xp)
                userMap.putInt("level", user.level)
                
                promise.resolve(userMap)
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error during login", e)
                promise.reject("DB_ERROR", "Error during login: ${e.message}")
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
                    userMap.putDouble("creationDate", user.creationDate.toDouble())
                    userMap.putInt("xp", user.xp)
                    userMap.putInt("level", user.level)
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
    fun getUserById(userId: Int, promise: Promise) {        executorService.execute {
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
                userMap.putDouble("creationDate", user.creationDate.toDouble())
                userMap.putInt("xp", user.xp)
                userMap.putInt("level", user.level)
                
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
                // Get the existing user
                val userId = userMap.getInt("id")
                val existingUser = database.userDao().getById(userId)
                
                if (existingUser == null) {
                    promise.reject("USER_NOT_FOUND", "User not found")
                    return@execute
                }
                
                // Update only the fields that are provided
                if (userMap.hasKey("name")) {
                    existingUser.name = userMap.getString("name") ?: existingUser.name
                }
                
                if (userMap.hasKey("email")) {
                    existingUser.email = userMap.getString("email") ?: existingUser.email
                }
                
                if (userMap.hasKey("password")) {
                    existingUser.password = userMap.getString("password") ?: existingUser.password
                }
                
                database.userDao().update(existingUser)
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
                val user = database.userDao().getById(userId)
                if (user == null) {
                    promise.reject("USER_NOT_FOUND", "User not found")
                    return@execute
                }
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

    @ReactMethod
    fun awardXP(userId: Int, xpAmount: Int, promise: Promise) {
        executorService.execute {
            try {
                val user = database.userDao().getById(userId)
                if (user == null) {
                    promise.reject("USER_NOT_FOUND", "User not found")
                    return@execute
                }                // Calculate new XP and level
                val newXP = minOf(user.xp + xpAmount, 9999) // Cap XP at 9999
                val newLevel = calculateLevelFromXP(newXP)

                // Update user with new XP and level
                database.userDao().awardXP(userId, newXP - user.xp, newLevel)

                // Fetch updated user
                val updatedUser = database.userDao().getById(userId)
                if (updatedUser != null) {
                    val userMap = WritableNativeMap()
                    userMap.putInt("id", updatedUser.id)
                    userMap.putString("name", updatedUser.name)
                    userMap.putString("email", updatedUser.email)
                    userMap.putDouble("creationDate", updatedUser.creationDate.toDouble())
                    userMap.putInt("xp", updatedUser.xp)
                    userMap.putInt("level", updatedUser.level)
                    promise.resolve(userMap)
                } else {
                    promise.reject("DB_ERROR", "Failed to fetch updated user")
                }
            } catch (e: Exception) {
                Log.e("DatabaseModule", "Error awarding XP", e)
                promise.reject("DB_ERROR", "Error awarding XP: ${e.message}")
            }
        }
    }    private fun calculateLevelFromXP(xp: Int): Int {
        // New level progression: 0, 500, 750, 1125, 1688, 2531, 3797, 5696 XP
        val levelThresholds = intArrayOf(0, 500, 750, 1125, 1688, 2531, 3797, 5696)
        
        for (i in levelThresholds.size - 1 downTo 0) {
            if (xp >= levelThresholds[i]) {
                return minOf(i + 1, 8) // Cap at level 8
            }
        }
        return 1
    }
}