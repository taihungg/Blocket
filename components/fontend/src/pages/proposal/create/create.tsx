import styles from './create.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const CreateProposal = () => {
    // const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    // const moths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    // const years = [1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    // const [signUpData, setSignUpdata] = useState({
    //     username: '',
    //     dateOfBirth: {
    //         day: '1',
    //         moth:'1',
    //         year: '1970'
    //     },
    //     gender: 'Male' as 'Male' | 'Female' | 'Scibidi',
    //     email:'',
    //     password:''
    // });
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if(signUpData.username !== '' && signUpData.email !== '' && signUpData.password !== '') {

    //         //kiểm tra valid
    //         //=============//
            
    //         const userSignupInfo = {
    //             name : signUpData.username,
    //             email : signUpData.email,
    //             password : signUpData.password,
    //             dateOfBirth : `${signUpData.dateOfBirth.year}-${signUpData.dateOfBirth.moth}-${signUpData.dateOfBirth.day}`,
    //             gender : signUpData.gender ,
    //         }
    //         // const signup_req = signupRequest(userSignupInfo)            
    //         // console.log(signup_req);

    //         //set to default state in form 
    //         setSignUpdata({
    //             username: '',
    //             dateOfBirth: {
    //                 day: '1',
    //                 moth:'1',
    //                 year: '1970'
    //             },
    //             gender: 'Male',
    //             email:'',
    //             password:''
    //         });
    //     }
    //     else{
    //         alert('You must full fill');
    //     }
    // }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }
    return (
       <div className={cx('wrapper')}>
            <div className={cx('label')}><h1>Mizu</h1></div>
            <div className={cx('resgister')}>
                 <div className={cx('form')}>
                    <div className={cx('title')}>
                        <h3>Create proposal</h3> 
                        <p>-- Secure --</p>
                    </div> 
                    <form onSubmit={e => handleSubmit(e)}>

                        <div className={cx('input-title')}>
                            <h3>title</h3>
                            <input type="text" />
                        </div>
                        <div className={cx('input-options')}>
                            <h3>options</h3>
                            <option value="">
                                
                            </option>
                        </div>
                        <div className={cx('input-numofvote')}>
                            <h3></h3>
                            <input type="text" />
                        </div>
                        <div className={cx('input-conditions')}>
                            <h3>title</h3>
                            <input type="text" />
                        </div>
                        <div className={cx('input-expires')}>
                            <h3>title</h3>
                            <input type="text" />
                        </div>
                        <div className={cx('policy')}>
                       Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên mizu. Tìm hiểu thêm.<br></br>
<br></br>Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi. Bạn có thể nhận được thông báo của chúng tôi qua SMS và hủy nhận bất kỳ lúc nào.     
                        </div> 
                        <div className={cx('submit')}>
                            <input type="submit" value="create proposal" />
                        </div> 
                        <div className={cx('have-account')}>
                            <a>Did you have a account?</a>
                        </div>
                    </form>
                 </div> 
            </div> 
       </div> 
    )
}
export default CreateProposal