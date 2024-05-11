using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class FeedbackViewModel
    {
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "From 10 to 500 characters")]
        public string FeedBackText { get; set; }
        [Range(1, 5, ErrorMessage = "From 1 to 5")]
        [Required(ErrorMessage = "The field must be filled")]
        public int FeedBackMark { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public int? EmployeeForId { get; set; }
        public int? EmployeeFromId { get; set; }
    }
}
