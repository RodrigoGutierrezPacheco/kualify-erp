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
                            password: '',
                            confirmPassword: ''
                        });
                    } else {
                        setErrors({ form: 'Failed to load user data' });
                        setIsOpen(false);
                    }
                } catch (error) {
                    setErrors({ form: 'Error loading user data' });
                    setIsOpen(false);
                } finally {
                    setFetchingUser(false);
                }
            } else if (!userId && isOpen) {
                // Reset form for new user
                setFormData({
                    email: '',
                    username: '',
                    password: '',
                    confirmPassword: ''
                });
            }
        };

        fetchUserData();
    }, [userId, isOpen, setIsOpen]);

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        // Only validate password fields if it's a new user or password is being changed
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
            let response;
            if (userId) {
                // Update existing user
                const updateData: any = {
                    email: formData.email,
                    username: formData.username
                };
                // Only include password if it's being changed
                if (formData.password) {
                    updateData.password = formData.password;
                }
                
                response = await updateUserById(userId, updateData);
            } else {
                // Create new user
                response = await createUser({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                });
            }
            
            if (response.statusCode === 200 || response.statusCode === 201) {
                setIsOpen(false);
                // Show success toast
            } else {
                setErrors({ form: response.message });
            }
        } catch (error) {
            setErrors({ form: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
            refetchUsers && refetchUsers();
        }
    };

    if (fetchingUser) {
        return (
            <div className='hidden'>
                <Frame>
                    <Modal
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Loading user data..."
                    >
                        <Modal.Section>
                            <TextContainer>
                                <p>Loading user information...</p>
                            </TextContainer>
                        </Modal.Section>
                    </Modal>
                </Frame>
            </div>
        );
    }

    return (
        <div className='hidden'>
            <Frame>
                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={userId ? 'Update User' : 'Create User'}
                    primaryAction={{
                        content: userId ? 'Update User' : 'Create User',
                        onAction: handleSubmit,
                        loading: loading,
                        disabled: loading || fetchingUser
                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => setIsOpen(false),
                        },
                    ]}
                >
                    <Modal.Section>
                        <TextContainer>
                            {errors.form && (
                                <Banner>
                                    {errors.form}
                                </Banner>
                            )}

                            <div style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Username"
                                    value={formData.username}
                                    onChange={handleChange('username')}
                                    error={errors.username}
                                    autoComplete="username"
                                    disabled={fetchingUser}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    type="email"
                                    error={errors.email}
                                    autoComplete="email"
                                    disabled={fetchingUser}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
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
                            </div>
                            {(!userId || formData.password) && (
                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        label="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange('confirmPassword')}
                                        type="password"
                                        error={errors.confirmPassword}
                                        autoComplete="new-password"
                                        disabled={fetchingUser}
                                    />
                                </div>
                            )}
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
}