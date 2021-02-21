CREATE PROCEDURE dbo.uspLogin @pUserName NVARCHAR(50),
	@pPassword NVARCHAR(50),
	@statusCode INT OUTPUT,
	@responseMessage NVARCHAR(250) = '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @id INT
	DECLARE @active BIT
	DECLARE @userID INT

	SELECT TOP 1 @id = id,
		@active = active
	FROM [dbo].[Users]
	WHERE userName = @pUserName

	IF (@id IS NOT NULL)
	BEGIN
		IF (@active = 0)
		BEGIN
			SET @statusCode = 3
			SET @responseMessage = 'User inactive'
		END
		ELSE
		BEGIN
			SET @userID = (
					SELECT id
					FROM [dbo].[Users]
					WHERE userName = @pUserName
						AND passwordHash = HASHBYTES('SHA2_512', @pPassword + CAST(salt AS NVARCHAR(36)))
					)

			IF (@userID IS NULL)
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

--Correct login and password
DECLARE @statusCode INT
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspLogin @pUserName = N'Admin',
	@pPassword = N'123',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'statusCode',
	@responseMessage AS N'responseMessage';

--Invalid login
DECLARE @statusCode INT
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspLogin @pUserName = N'Admin1',
	@pPassword = N'123',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'statusCode',
	@responseMessage AS N'responseMessage';

--Incorrect password
DECLARE @statusCode INT
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspLogin @pUserName = N'Admin',
	@pPassword = N'1234',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'statusCode',
	@responseMessage AS N'responseMessage';

--User inactive
DECLARE @statusCode INT
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspLogin @pUserName = N'Admin2',
	@pPassword = N'123',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'statusCode',
	@responseMessage AS N'responseMessage';
