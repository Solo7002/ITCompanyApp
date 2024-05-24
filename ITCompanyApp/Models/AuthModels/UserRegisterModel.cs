using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.AuthModels
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
        [Compare(nameof(Password), ErrorMessage = "Values do not match")]
        public string ConfirmPassword { get; set; }

        public string RoleName { get; set; }


        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "From 2 to 30 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "From 2 to 30 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime BirthDate { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50)]
        [RegularExpression(@"(?<name>[\w.]+)\@(?<domain>\w+\.\w+)(\.\w+)?", ErrorMessage = "Incorrect address")]
        public string Email { get; set; }

        public string PhotoFile { get; set; }

        public double Salary { get; set; }

        public string DepartmentName { get; set; }

        public string JobName { get; set; }
    }
}
