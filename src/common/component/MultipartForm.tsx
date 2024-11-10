import React, { ComponentType, FC, useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DefaultValues, IUser } from '../interface/Auth/auth';
const duration = 300;

type MyComponentType = {
    component: (ref: React.RefObject<any>, className?: string) => JSX.Element;
};

type Props = {
    title?: string;
    children: Array<MyComponentType>;
    defaultValues: any
};

const MultipartForm: FC<Props> = ({ title, children,defaultValues }) => {
    const [currentChildIndex, setCurrentChildIndex] = useState(0);
    const [isIn, setIsIn] = useState(true);
    const nodeRef = useRef(null);
    const methods = useForm<DefaultValues>();

    const onError = (error:any) => {
        console.log(error)

    }
    const changeFormSection = (type: 'next' | 'previous') => {
        setIsIn(false);
        setTimeout(() => {
            setCurrentChildIndex((prevIndex) =>
                type === 'next' ? prevIndex + 1 : prevIndex - 1
            );
            setIsIn(true);
        }, duration);
    };
    const onSubmit = (formVal:typeof defaultValues) => {
        console.log(formVal)
    }
    const CurrentComponent = children[currentChildIndex].component
    return (
        <div className='form-container'>
            {title && <h1>{title}</h1>}
            <FormProvider {...methods}>
                <form  onSubmit={methods.handleSubmit(onSubmit,onError)}>
                    <Transition nodeRef={nodeRef} in={isIn} timeout={duration}>
                        {() => (
                            <>
                                 {CurrentComponent(nodeRef, isIn ? 'tran-in' : 'tran-out')}
                            </>
                        )}
                    </Transition>
                    <div className='btn-container' style={{ display: 'flex', justifyContent: 'space-between' }}>
                {children.length > 1 && <button
                type='button'
                    disabled={currentChildIndex === 0}
                    onClick={() => {
                        changeFormSection('previous');
                    }}
                >
                    Previous
                </button>}
                {children.length > 1 && currentChildIndex < children.length-1 && <button
                type='button'
                    onClick={() => {                        
                        changeFormSection('next');
                    }}
                >
                    Next
                </button>}
                {currentChildIndex === children.length-1 && <button
                    type={ 'submit'}
                >
                    Submit
                </button>}
            </div>
                </form>
            </FormProvider>


        </div>
    );
};

export default MultipartForm;
