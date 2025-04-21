package com.brainbuzz.database

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update

@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAll(): List<User>
    
    @Query("SELECT * FROM users WHERE id = :userId")
    fun getById(userId: Int): User?
    
    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    fun getUserByEmail(email: String): User?
    
    @Query("SELECT * FROM users WHERE email = :email AND password = :password LIMIT 1")
    fun login(email: String, password: String): User?
    
    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE email = :email LIMIT 1)")
    fun isEmailTaken(email: String): Boolean
    
    @Insert
    fun insert(user: User): Long
    
    @Update
    fun update(user: User)
    
    @Delete
    fun delete(user: User)
    
    @Query("DELETE FROM users")
    fun deleteAll()
}