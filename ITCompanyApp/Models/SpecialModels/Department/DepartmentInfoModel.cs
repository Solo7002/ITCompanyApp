using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.SpecialModels.Department
{
    public class DepartmentInfoModel
    {
        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; }

        public string DepartmentHeadName { get; set; }
        
        public int AmountOfWorkers { get; set; }
    }
}
