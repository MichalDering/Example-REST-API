CREATE PROCEDURE dbo.uspAddUser @pUserName NVARCHAR(50),
	@pPassword NVARCHAR(50),
	@pFirstName NVARCHAR(80),
	@pLastName NVARCHAR(80),
	@pActive BIT = 1,
	@pComment NVARCHAR(80) = NULL,
	@statusCode INT OUTPUT,
	@responseMessage NVARCHAR(250) OUTPUT
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @salt UNIQUEIDENTIFIER = NEWID()

	BEGIN TRY
		INSERT INTO dbo.[Users] (
			userName,
			passwordHash,
			salt,
			firstName,
			lastName,
			active,
			comment
			)
		VALUES (
			@pUserName,
			HASHBYTES('SHA2_512', @pPassword + CAST(@salt AS NVARCHAR(36))),
			@salt,
			@pFirstName,
			@pLastName,
			@pActive,
			@pComment
			)

		SET @statusCode = 0
		SET @responseMessage = 'Success'
	END TRY

	BEGIN CATCH
		SET @statusCode = 1
		SET @responseMessage = ERROR_MESSAGE()
	END CATCH
END

--example call
DECLARE @statusCode INT
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspAddUser @pUserName = N'Admin',
	@pPassword = N'123',
	@pFirstName = N'Admin',
	@pLastName = N'Administrator',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'@statusCode',
	@responseMessage AS N'@responseMessage'

SELECT id,
	userName,
	passwordHash,
	salt,
	firstName,
	lastName,
	active,
	comment
FROM [dbo].[Users]

--example call
DECLARE @statusCode INT
DECLARE @responseMessage NVARCHAR(250)

EXEC dbo.uspAddUser @pUserName = N'Admin2',
	@pPassword = N'123',
	@pFirstName = N'Admin2',
	@pLastName = N'Administrator2',
	@pActive = 1,
	@pComment = N'Superuser',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'@statusCode',
	@responseMessage AS N'@responseMessage'

SELECT id,
	userName,
	passwordHash,
	salt,
	firstName,
	lastName,
	active,
	comment
FROM [dbo].[Users]
