CREATE TABLE Users (
    id int IDENTITY(1,1) PRIMARY KEY,
    userName nvarchar(50) NOT NULL UNIQUE,
    passwordHash BINARY(64) NOT NULL,
    salt UNIQUEIDENTIFIER NOT NULL,
    firstName nvarchar(80) NOT NULL,
    lastName nvarchar(80) NOT NULL,
    active bit NOT NULL,
    comment nvarchar(80)
);

CREATE NONCLUSTERED INDEX IX_UsersUserName on Users(userName)

CREATE TABLE Tasks (
    id int IDENTITY(1,1) PRIMARY KEY,
    userId int NOT NULL FOREIGN KEY REFERENCES Users(id),
    summary nvarchar(255) NOT NULL,
    status nvarchar(20) NOT NULL
);

CREATE NONCLUSTERED INDEX IX_TasksUserIdStatus on Tasks(userId, status)

CREATE TABLE WorkLogs (
    id int IDENTITY(1,1) PRIMARY KEY,
    userId int NOT NULL FOREIGN KEY REFERENCES Users(id),
    taskId int NOT NULL FOREIGN KEY REFERENCES Tasks(id),
    reportedHours int NOT NULL,
    CONSTRAINT UC_WorkLogs UNIQUE (userId, taskId)
);

CREATE NONCLUSTERED INDEX IX_WorkLogsUserIdTaskId on WorkLogs(userId, taskId)
