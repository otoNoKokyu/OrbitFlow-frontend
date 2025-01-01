import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { EditProfileModel } from '../../model/user-edit-model';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface EditProfileProps {}

const EditProfile: FC<EditProfileProps> = () => {
    const form = useForm<EditProfileModel>({defaultValues: {}});
    return (
        <>
            <Form {...form}>
                <form className='w-80 m-10' onSubmit={form.handleSubmit(()=> console.log('sumbited!'))}>
                    <FormField
                        name='username'
                        control={form.control}
                        render={({field})=> (
                            <FormItem className='mt-2'>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input className='hover:bg-slate-50' id="username" placeholder="Username" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='first_name'
                        control={form.control}
                        render={({field})=> (
                            <FormItem className='mt-2'>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input className='hover:bg-slate-50' id="firstName" placeholder="Fisrt Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='last_name'
                        control={form.control}
                        render={({field})=> (
                            <FormItem className='mt-2'>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input className='hover:bg-slate-50' id="lastName" placeholder="Last Name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='address'
                        control={form.control}
                        render={({field})=> (
                            <FormItem className='mt-2'>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input className='hover:bg-slate-50' id="address" placeholder="Address" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='city'
                        control={form.control}
                        render={({field})=> (
                            <FormItem className='mt-2'>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input className='hover:bg-slate-50' id="city" placeholder="City" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className='mt-4' type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}

export default EditProfile;
