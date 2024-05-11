using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class DepartmentViewModel
    {
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "From 2 to 50 characters")]
        public string DepartmentName { get; set; }
        public int? DepartmentHeadId { get; set; }
    }
}
