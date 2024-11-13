import React, { ComponentType, FC, useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import { useRef } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { DefaultValues, IUser } from '../interface/Auth/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
const duration = 300;

type MyComponentType = {
    component: (ref: React.RefObject<any>, className?: string) => JSX.Element;
};

type Props<T> = {
    title?: string;
    children: Array<MyComponentType>;
    saveFn: (data: T) => Promise<T | void>;
};

const MultipartForm = <T,>({ title, children,saveFn }: Props<T>) => {
    const {setUserMeta} = useAuth()
    const [currentChildIndex, setCurrentChildIndex] = useState(0);
    const [formAction, setFormAction] = useState('next');
    const [isIn, setIsIn] = useState(true);
    const nodeRef = useRef(null);
    const methods = useForm();
    const navigate = useNavigate()

    const changeFormSection = (type: 'next' | 'previous') => {
        setIsIn(false);
        setTimeout(() => {
            setCurrentChildIndex((prevIndex) =>
                type === 'next' ? prevIndex + 1 : prevIndex - 1
            );
            setIsIn(true);
        }, duration);
    };
    const onSubmit = async(formVal: any) => {
        if (isLastStep) {
            const data = await saveFn(formVal) as IUser
            setUserMeta(data)
            navigate('/login')
            return 
        }
        changeFormSection('next')
    }
    const isLastStep = currentChildIndex === children.length-1
    const CurrentComponent = children[currentChildIndex].component
    return (
        <div className='form-container'>
            {title && <h1>{title}</h1>}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Transition nodeRef={nodeRef} in={isIn} timeout={duration}>
                        {() => (
                                CurrentComponent(nodeRef, isIn ? 'tran-in' : 'tran-out')
                        )}
                    </Transition>
                    <div className='btn-container' style={{ display: 'flex', justifyContent: 'space-between', marginTop:'100px' }}>
                        {
                            children.length > 1 && <button
                                type='button'
                                disabled={currentChildIndex === 0}
                                onClick={() => {
                                    changeFormSection('previous')
                                }}
                            >
                                Previous
                            </button>}
                        {children.length > 1 && <button
                            type='submit'
                        >
                            {isLastStep? 'submit': 'next'}
                        </button>}
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default MultipartForm;
