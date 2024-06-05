namespace ITCompanyApp.Models.AuthModels
{
    public class EmailConfirmModel
    {
        public string? Email { get; set; }
        public string? ConfirmationCode { get; set; }
        public string? NewPassword { get; set;}
    }
}
