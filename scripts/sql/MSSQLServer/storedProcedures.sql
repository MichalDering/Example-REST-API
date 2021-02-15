CREATE PROCEDURE dbo.uspAddUser
    @pLogin NVARCHAR(50), 
    @pPassword NVARCHAR(50),
    @pFirstName NVARCHAR(80), 
    @pLastName NVARCHAR(80),
    @pActive bit = 1,
    @pComment nvarchar(80) = NULL,
    @statusCode int OUTPUT,
    @responseMessage NVARCHAR(250) OUTPUT
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @salt UNIQUEIDENTIFIER=NEWID()
    BEGIN TRY

        INSERT INTO dbo.[Users] (userName, passwordHash, salt, firstName, lastName, active, comment)
        VALUES(@pLogin, HASHBYTES('SHA2_512', @pPassword+CAST(@salt AS NVARCHAR(36))), @salt, @pFirstName, @pLastName, @pActive, @pComment)
       
       SET @statusCode = 0
       SET @responseMessage = 'Success'

    END TRY
    BEGIN CATCH
        SET @statusCode = 1
        SET @responseMessage = ERROR_MESSAGE() 
    END CATCH

END

--example call

DECLARE @statusCode int
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspAddUser
    @pLogin = N'Admin',
    @pPassword = N'123',
    @pFirstName = N'Admin',
    @pLastName = N'Administrator',
    @statusCode = @statusCode OUTPUT,
    @responseMessage = @responseMessage OUTPUT

SELECT @statusCode as N'@statusCode', @responseMessage as N'@responseMessage';

SELECT id, userName, passwordHash, salt, firstName, lastName, active, comment
FROM [dbo].[Users]

--example call

DECLARE @statusCode int
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspAddUser
    @pLogin = N'Admin2',
    @pPassword = N'123',
    @pFirstName = N'Admin2',
    @pLastName = N'Administrator2',
    @pActive = 1,
    @pComment = N'Superuser',
    @statusCode = @statusCode OUTPUT,
    @responseMessage = @responseMessage OUTPUT

SELECT @statusCode as N'@statusCode', @responseMessage as N'@responseMessage';

SELECT id, userName, passwordHash, salt, firstName, lastName, active, comment
FROM [dbo].[Users]

--

CREATE PROCEDURE dbo.uspLogin
    @pLoginName NVARCHAR(50),
    @pPassword NVARCHAR(50),
    @statusCode int OUTPUT,
    @responseMessage NVARCHAR(250) = '' OUTPUT
AS
BEGIN

    SET NOCOUNT ON

    DECLARE @id INT
    DECLARE @active BIT
    DECLARE @userID INT

    SELECT TOP 1 @id = id, @active = active FROM [dbo].[Users] WHERE userName = @pLoginName

    IF(@id IS NOT NULL)
    BEGIN
        IF(@active = 0)
        BEGIN
           SET @statusCode = 3
           SET @responseMessage = 'User inactive'
        END
        ELSE
        BEGIN
            SET @userID = (SELECT id FROM [dbo].[Users] WHERE userName = @pLoginName AND passwordHash = HASHBYTES('SHA2_512', @pPassword+CAST(salt AS NVARCHAR(36))))
            IF(@userID IS NULL)
            BEGIN
                SET @statusCode = 2
                SET @responseMessage = 'Incorrect password'
            END
            ELSE
            BEGIN
                SET @statusCode = 0
                SET @responseMessage = 'User successfully logged in'
            END
        END
    END
    ELSE
    BEGIN
       SET @statusCode = 1
       SET @responseMessage = 'Invalid login'
    END
END

--example calls

DECLARE @statusCode int
DECLARE @responseMessage nvarchar(250)

--Correct login and password
EXEC	dbo.uspLogin
		@pLoginName = N'Admin',
		@pPassword = N'123',
		@statusCode = @statusCode OUTPUT,
		@responseMessage = @responseMessage OUTPUT

SELECT @statusCode as N'@statusCode', @responseMessage as N'@responseMessage';

--Incorrect login
EXEC	dbo.uspLogin
		@pLoginName = N'Admin1', 
		@pPassword = N'123',
		@statusCode = @statusCode OUTPUT,
		@responseMessage = @responseMessage OUTPUT

SELECT @statusCode as N'@statusCode', @responseMessage as N'@responseMessage';

--Incorrect password
EXEC	dbo.uspLogin
		@pLoginName = N'Admin', 
		@pPassword = N'1234',
		@statusCode = @statusCode OUTPUT,
		@responseMessage = @responseMessage OUTPUT

SELECT @statusCode as N'@statusCode', @responseMessage as N'@responseMessage';

--User inactive
EXEC	dbo.uspLogin
		@pLoginName = N'Admin2', 
		@pPassword = N'123',
		@statusCode = @statusCode OUTPUT,
		@responseMessage = @responseMessage OUTPUT

SELECT @statusCode as N'@statusCode', @responseMessage as N'@responseMessage';
