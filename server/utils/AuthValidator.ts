export const validateRegisterInput = (username, password, confirmPassword) => {
    let errors = '';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (username.trim() === '') {
        errors = 'Username must not be empty.';
    }else if (username.trim().includes(' ') || !emailRegex.test(username.trim())) {
        errors = 'Invalid Email.';
    }

    // if (username.trim().length < 4 || username.trim().length > 12) {
    //     errors = 'Username must be between 4-12 characters';
    // }

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (password.trim() === '') {
        errors = 'Password must not be empty.';
    } else if (password !== confirmPassword) {
        errors = 'Passwords must match.';
    } else if (password.trim().length < 8) {
        errors = 'Password must be more than 8 characters long.';
    } else if (!specialChars.test(password.trim())) {
        errors = 'Password must have special character.';
    } else if (confirmPassword.trim() && password !== confirmPassword) {
        errors = 'Password not match...!';
    }
    

    return { valid: errors === '', errors };
};

export const validateLoginInput = (username, password) => {
    let errors = '';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
   
    // return error;
    if (username.trim() === '') {
        errors = 'Email must not be empty.';
    }else if (username.trim().includes(' ') || !emailRegex.test(username.trim())) {
        errors = 'Invalid Email.';
    }
    if (password.trim() === '') {
        errors = 'Password must not be empty.';
    }

    return { valid: errors === '', errors };
};

export const validatePasswordInput = (password, confirmPassword) => {
    let errors = '';

    // if (password.trim() === '') {
    //     errors = 'Password must not be empty.';
    // } else if (password !== confirmPassword) {
    //     errors = 'Passwords must match.';
    // }

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (password.trim() === '') {
        errors = 'Password must not be empty.';
    } else if (password !== confirmPassword) {
        errors = 'Passwords must match.';
    } else if (password.trim().length < 8) {
        errors = 'Password must be more than 8 characters long.';
    } else if (!specialChars.test(password.trim())) {
        errors = 'Password must have special character.';
    } else if (confirmPassword.trim() && password.trim() !== confirmPassword.trim()) {
        errors = 'Password not match...!';
    }
    

    return { valid: errors === '', errors };
};
