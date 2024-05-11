using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class EmployeeViewModel
    {
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
        public int? DepartmentId { get; set; }
        public int? JobId { get; set; }
    }
}
