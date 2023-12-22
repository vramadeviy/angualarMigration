export  class AppValidationMessages {
    static errorMessages = {
        'email' : {
            'email' : 'Please enter a valid email address',
            'required' : 'Email address is required'
        },
        'password' : {
            'required' : 'Password is required',
            'minlength' : 'Password must be at least 8 characters',
        }
    };
}