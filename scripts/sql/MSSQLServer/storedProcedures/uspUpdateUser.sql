CREATE PROCEDURE dbo.uspUpdateUser @pId INT,
	@pPassword NVARCHAR(50) = NULL,
	@pFirstName NVARCHAR(80) = NULL,
	@pLastName NVARCHAR(80) = NULL,
	@pActive BIT = NULL,
	@pComment NVARCHAR(80) = NULL,
	@statusCode INT OUTPUT,
	@responseMessage NVARCHAR(250) OUTPUT
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @newPasswordHash BINARY (64)
	DECLARE @salt UNIQUEIDENTIFIER
	DECLARE @oldPasswordHash BINARY (64)
	DECLARE @oldFirstName NVARCHAR(80)
	DECLARE @oldLastName NVARCHAR(80)
	DECLARE @oldActive BIT
	DECLARE @oldComment NVARCHAR(80)

	SELECT @salt = salt,
		@oldPasswordHash = passwordHash,
		@oldFirstName = firstName,
		@oldLastName = lastName,
		@oldActive = active,
		@oldComment = comment
	FROM [dbo].[Users]
	WHERE id = @pId

	IF (@pPassword IS NULL)
	BEGIN
		SET @newPasswordHash = @oldPasswordHash
	END
	ELSE
	BEGIN
		SET @newPasswordHash = HASHBYTES('SHA2_512', @pPassword + CAST(@salt AS NVARCHAR(36)))
	END

	IF (@pFirstName IS NULL)
	BEGIN
		SET @pFirstName = @oldFirstName
	END

	IF (@pLastName IS NULL)
	BEGIN
		SET @pLastName = @oldLastName
	END

	IF (@pActive IS NULL)
	BEGIN
		SET @pActive = @oldActive
	END

	IF (@pComment IS NULL)
	BEGIN
		SET @pComment = @oldComment
	END

	BEGIN TRY
		UPDATE Users
		SET passwordHash = @newPasswordHash,
			firstName = @pFirstName,
			lastName = @pLastName,
			active = @pActive,
			comment = @pComment
		WHERE id = @pId

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

EXEC dbo.uspUpdateUser @pId = 7,
	@pPassword = N'123',
	@pFirstName = N'Admin',
	@pLastName = N'Administrator',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'statusCode',
	@responseMessage AS N'responseMessage';

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

EXEC dbo.uspUpdateUser @pId = 7,
	@pPassword = N'123',
	@pFirstName = N'Admin',
	@pLastName = N'Administrator',
	@pActive = 1,
	@pComment = N'Superuser',
	@statusCode = @statusCode OUTPUT,
	@responseMessage = @responseMessage OUTPUT

SELECT @statusCode AS N'statusCode',
	@responseMessage AS N'responseMessage';

SELECT id,
	userName,
	passwordHash,
	salt,
	firstName,
	lastName,
	active,
	comment
FROM [dbo].[Users]
