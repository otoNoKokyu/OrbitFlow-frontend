import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { EditProfileModel } from '../../model/user-edit-model';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../../components/ui/calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import ErrorHandler from '../../common/component/ErrorHandler';
import editProfileService from './service/edit.profle.service';
import authService from '../Authentication/service/auth.service';
import { KeyMeta } from '../../common/types/Auth/auth';

interface EditProfileProps { }

const EditProfile: FC<EditProfileProps> = () => {
    const {userId} = authService.getUserMeta([KeyMeta.USER]);
    console.log(userId);
    const form = useForm<EditProfileModel>({ defaultValues: {} });
    const onSubmit = async(form: EditProfileModel) => {
        try {
            if(!userId && userId === undefined) return;
            const response = await editProfileService.editUserProfile(form);
            console.log(response);
        } catch (error){
            console.log(error)
        }
    }
    return (
        <div className='border rounded-xl p-8 bg-gray-50-50 max-w-xl m-4 hover:border-blue-500'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-12">
                        <div className="simple-info-conainer">
                            <FormField
                                name='username'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input className='focus:outline-red-500' id="username" placeholder="Username" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='first_name'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="firstName" placeholder="Fisrt Name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='last_name'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="lastName" placeholder="Last Name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='address'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="address" placeholder="Address" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='city'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="city" placeholder="City" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='country'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="country" placeholder="Country" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="credenial-info-conainer">
                            <FormField
                                name='email'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' type='email' id="lastName" placeholder="Email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='date_of_birth'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 justify-start text-left font-normal focus: bg-[#E8F0FE]",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <FontAwesomeIcon className='mr-2 h-4 w-4' icon={faCalendar} />
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    className="rounded-md border"
                                                    captionLayout='dropdown-buttons'
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    fromYear={1900}
                                                    toYear={2030}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='zip_code'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Pin code</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="Pin" placeholder="Pin code" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='state'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="state" placeholder="State" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='phone_number'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input className='hover:bg-gray-100' id="phone-number" placeholder="Phone" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                name='gender'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-60'>
                                        <FormLabel>Gender</FormLabel>
                                        <FormControl>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Gender">{field.value}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            /> */}
                        </div>
                    </div>
                    <Button className='mt-4' type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default EditProfile;
