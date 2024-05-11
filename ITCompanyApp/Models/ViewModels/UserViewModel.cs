using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class UserViewModel
    {
        [StringLength(30, MinimumLength = 4, ErrorMessage = "From 4 to 30 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        public string Login { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        public string Password { get; set; }
        public int? AccessLevelId { get; set; }
    }
}
