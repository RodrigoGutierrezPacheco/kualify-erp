import { Frame, Modal, TextContainer, TextField, Banner } from '@shopify/polaris';
import { createAdmin, updateAdminById, getAdminById } from '../../services/admins';
import { useState, useEffect } from 'react';
import { validateEmail, validatePassword, validatePasswordMatch } from '../../utils/validations';

export interface CreateProfesionalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    refetchProfesionals?: () => void;
    profesionalId?: string;
}

export default function CreateAdminModal({ isOpen, setIsOpen, refetchProfesionals, profesionalId }: CreateProfesionalProps) {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [fetchingProfesional, setFetchingProfesional] = useState(false);

    useEffect(() => {
        const fetchProfesionalData = async () => {
            if (profesionalId && isOpen) {
                setFetchingProfesional(true);
                try {
                    const response = await getAdminById(profesionalId);
                    if (response.statusCode === 200) {
                        setFormData({
                            email: response.data.email,
                            name: response.data.adminName,
                            password: '',
                            confirmPassword: ''
                        });
                    } else {
                        setErrors({ form: 'Failed to load profesional data' });
                        setIsOpen(false);
                    }
                } catch (error) {
                    setErrors({ form: 'Error loading profesional data' });
                    setIsOpen(false);
                } finally {
                    setFetchingProfesional(false);
                }
            } else if (!profesionalId && isOpen) {
                // Reset form for new profesional
                setFormData({
                    email: '',
                    name: '',
                    password: '',
                    confirmPassword: ''
                });
            }
        };

        fetchProfesionalData();
    }, [profesionalId, isOpen, setIsOpen]);

    const handleChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when profesional starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Only validate password fields if it's a new profesional or password is being changed
        if (!profesionalId || formData.password || formData.confirmPassword) {
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
            if (profesionalId) {
                // Update existing profesional
                const updateData: any = {
                    email: formData.email,
                    adminName: formData.name
                };
                // Only include password if it's being changed
                if (formData.password) {
                    updateData.password = formData.password;
                }

                response = await updateAdminById(profesionalId, updateData);
            } else {
                // Create new profesional
                response = await createAdmin({
                    email: formData.email,
                    adminName: formData.name,
                    password: formData.password
                });
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                setIsOpen(false);
                if (refetchProfesionals) refetchProfesionals();
            } else {
                setErrors({ form: response.message });
            }
        } catch (error) {
            setErrors({ form: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProfesional) {
        return (
            <div className='hidden'>
                <Frame>
                    <Modal
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Loading profesional data..."
                    >
                        <Modal.Section>
                            <TextContainer>
                                <p>Loading profesional information...</p>
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
                    title={profesionalId ? 'Update Profesional' : 'Create Profesional'}
                    primaryAction={{
                        content: profesionalId ? 'Update Profesional' : 'Create Profesional',
                        onAction: handleSubmit,
                        loading: loading,
                        disabled: loading || fetchingProfesional
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
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    error={errors.name}
                                    autoComplete="name"
                                    disabled={fetchingProfesional}
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
                                    disabled={fetchingProfesional}
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
                                    helpText={profesionalId ? "Leave blank to keep current password" : undefined}
                                    disabled={fetchingProfesional}
                                />
                            </div>
                            {(!profesionalId || formData.password) && (
                                <div style={{ marginBottom: '16px' }}>
                                    <TextField
                                        label="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange('confirmPassword')}
                                        type="password"
                                        error={errors.confirmPassword}
                                        autoComplete="new-password"
                                        disabled={fetchingProfesional}
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