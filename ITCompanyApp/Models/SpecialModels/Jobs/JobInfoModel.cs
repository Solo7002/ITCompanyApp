using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.SpecialModels.Jobs
{
    public class JobInfoModel
    {
        public int JobId { get; set; }
        
        public string JobName { get; set; }

        public int AmountOfEmployees { get; set; }
    }
}
