import { Frame, Modal, TextContainer, TextField, Banner } from '@shopify/polaris';
import { createUser, updateUserById, getUserById } from '../../services/users';
import { useState, useEffect } from 'react';
import { validateEmail, validatePassword, validatePasswordMatch } from '../../utils/validations';

export interface CreateUserProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    refetchUsers?: () => void;
    userId?: string;
}

export default function CreateUserModal({ isOpen, setIsOpen, refetchUsers, userId }: CreateUserProps) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId && isOpen) {
                setFetchingUser(true);
                try {
                    const response = await getUserById(userId);
                    if (response.statusCode === 200) {
                        setFormData({
                            email: response.data.email,
                            username: response.data.username,
                            phoneNumber: response.data.phoneNumber || '',
                            password: '',
                            confirmPassword: ''
                        });
                    }
                } catch {
                    setErrors({ form: 'Error loading user data' });
                    setIsOpen(false);
                } finally {
                    setFetchingUser(false);
                }
            } else {
                setFormData({
                    email: '',
                    username: '',
                    phoneNumber: '',
                    password: '',
                    confirmPassword: ''
                });
            }
        };

        fetchUserData();
    }, [userId, isOpen, setIsOpen]);

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!userId || formData.password || formData.confirmPassword) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (!validatePassword(formData.password)) {
                newErrors.password = 'Password must be at least 8 characters';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userData = {
                email: formData.email,
                username: formData.username,
                phoneNumber: formData.phoneNumber,
                ...(formData.password ? { password: formData.password } : {})
            };

            const response = userId
                ? await updateUserById(userId, userData as any)
                : await createUser({
                    email: formData.email,
                    username: formData.username,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password
                });

            if ([200, 201].includes(response.statusCode)) {
                setIsOpen(false);
                refetchUsers?.();
            } else {
                setErrors({ form: response.message });
            }
        } catch {
            setErrors({ form: 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='hidden'>
            <Frame>
                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={userId ? 'Update User' : 'Create User'}
                    primaryAction={{
                        content: userId ? 'Update' : 'Create',
                        onAction: handleSubmit,
                        loading,
                        disabled: loading || fetchingUser
                    }}
                    secondaryActions={[{
                        content: 'Cancel',
                        onAction: () => setIsOpen(false),
                    }]}
                >
                    <Modal.Section>
                        <TextContainer>
                            {errors.form && <Banner tone="critical">{errors.form}</Banner>}

                            <TextField
                                label="Username"
                                value={formData.username}
                                onChange={handleChange('username')}
                                error={errors.username}
                                autoComplete="username"
                                disabled={fetchingUser}
                            />

                            <TextField
                                label="Email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                type="email"
                                error={errors.email}
                                autoComplete="email"
                                disabled={fetchingUser}
                            />

                            <TextField
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange('phoneNumber')}
                                type="tel"
                                error={errors.phoneNumber}
                                autoComplete="tel"
                                disabled={fetchingUser}
                            />

                            <TextField
                                label="Password"
                                value={formData.password}
                                onChange={handleChange('password')}
                                type="password"
                                error={errors.password}
                                autoComplete="new-password"
                                helpText={userId ? "Leave blank to keep current password" : undefined}
                                disabled={fetchingUser}
                            />

                            {(!userId || formData.password) && (
                                <TextField
                                    label="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    type="password"
                                    error={errors.confirmPassword}
                                    autoComplete="new-password"
                                    disabled={fetchingUser}
                                />
                            )}
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
}