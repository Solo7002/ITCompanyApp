using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Helpers
{
    public class UserRegisterModel
    {
        [StringLength(30, MinimumLength = 4, ErrorMessage = "From 4 to 30 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        public string Login { get; set; }

        [StringLength(50, MinimumLength = 8, ErrorMessage = "From 8 to 50 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        public string Password { get; set; }
        [StringLength(50, MinimumLength = 8, ErrorMessage = "From 8 to 50 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        [Compare(nameof(Password),ErrorMessage = "Values do not match")]
        public string ConfirmPassword { get; set; } 


        public string RoleName { get; set; }
    }
}
