package com.brainbuzz.database

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true) var id: Int = 0,
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "email") var email: String,
    @ColumnInfo(name = "password") var password: String,
    @ColumnInfo(name = "creation_date") var creationDate: Long,
    @ColumnInfo(name = "xp") var xp: Int = 0,
    @ColumnInfo(name = "level") var level: Int = 1
)