export const roleConfig = {
    '/tasks': ['Standard', 'Manager','Admin'],
    '/projects': ['Standard', 'Manager','Admin'],
    '/projects/create': ['Manager','Admin'],
    '/projects/details/:id': ['Standard', 'Manager','Admin'],
    '/projects/update/:id': ['Manager','Admin'],
    '/employees': ['Human Resource', 'Financial Resource','Admin'],
    '/employee/create': ['Human Resource','Admin'],
    '/employee/details/:id': ['Human Resource', 'Financial Resource','Admin'],
    '/employee/update/:id': ['Human Resource','Admin'],
    '/depsJobs': ['Human Resource','Admin'],
    '/finances': ['Financial Resource','Admin'],
  };