export const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|vu.edu\.pk|yahoo\.com|roshan\.af|proconsulti\.com)$/;
export const numberRegex = /^\d{12}$/

/**
 * Check if a password is strong.
 * Criteria:
 *  - Minimum 8 characters
 *  - At least one lowercase letter
 *  - At least one uppercase letter
 *  - At least one digit
 *  - At least one special character
 */
export const isStrongPassword = (password = "") => {
	if (typeof password !== 'string') return false;
	const strongPwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
	return strongPwdRegex.test(password);
}
