import { Frame, Modal, TextContainer, TextField, Banner } from '@shopify/polaris';
import { createUser } from '../../services/users';
import { useState } from 'react';
import { validateEmail, validatePassword, validatePasswordMatch } from '../../utils/validations';

export interface CreateUserProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    refetchUsers?: () => void;
}

export default function CreateUserModal({ isOpen, setIsOpen, refetchUsers }: CreateUserProps) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Limpiar error cuando el usuario empieza a escribir
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await createUser({
                email: formData.email,
                username: formData.username,
                password: formData.password
            });
            if (response.statusCode === 200 || response.statusCode === 201) {
                setIsOpen(false);
                // Mostrar toast de éxito
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

    return (
        <div className='hidden'>
            <Frame>
                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Create New User"
                    primaryAction={{
                        content: 'Create User',
                        onAction: handleSubmit,
                        loading: loading,
                        disabled: loading
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
                                <Banner >
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
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    type="password"
                                    error={errors.confirmPassword}
                                    autoComplete="new-password"
                                />
                            </div>
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
}