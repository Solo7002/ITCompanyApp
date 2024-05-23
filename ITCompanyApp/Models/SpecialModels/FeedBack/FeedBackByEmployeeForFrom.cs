using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.SpecialModels.FeedBack
{
    public class FeedBackByEmployeeForFrom
    {
        public int FeedBackId { get; set; }
        public string? FeedBackText { get; set; }
        public int FeedBackMark { get; set; }
        public string? FeedBackDate { get; set; }
        public string? EmployeeForName { get; set; }
        public string? EmployeeFromName { get; set; }
    }
}
