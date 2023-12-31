export let UserDataObj = [
    {
        userType: 'corporation',
        id: 'bigdev2023',
        password: 'bigdev2023!',
        confirmPassword: 'bigdev2023!',
        email: 'bigdev@gmail.com',
        emailService: 'yes',
        grade: 'C',
        name: '빅데브',
        num1: '010',
        num2: '1234',
        num3: '5678',
        smsService: 'yes',
        CMS: '',
        corporationData: {
            ceoName: '장민욱',
            companyName: 'UlsanBigDev',
            companyNum: {
                num1: '052',
                num2: '123',
                num3: '4567',
            },
            businessSector: 'SW Develop & IT service',
            businessCategory: '웹사이트 및 앱 개발',
            businessNum: '1234567890',
            FAX: '1800-3904',
        },
        address: {
            zonecode: 44781,
            roadAddress: '울산 남구 산업로440번길 8',
            bname: '여천동',
            buildingName: '(주)UlsanBigDev',
            jibunAddress: '(주)UlsanBigDev',
        },
        addressDetail: "1층",
        basketList: [],
        orderList: [],
    },
    { // 테스트용
        userType: 'individual',
        id: 'john_doe',
        password: 'securePassword123',
        confirmPassword: 'securePassword123',
        email: 'john.doe@example.com',
        emailService: 'yes',
        grade: 'A',
        name: 'John Doe',
        num1: '011',
        num2: '5678',
        num3: '1234',
        smsService: 'no',
        CMS: 'silver',
        corporationData: {
            ceoName: 'Jane Smith',
            companyName: 'Smith Enterprises',
            companyNum: {
                num1: '051',
                num2: '987',
                num3: '6543',
            },
            businessSector: 'Consulting',
            businessCategory: 'Business Services',
            businessNum: '9876543210',
            FAX: '1234-5678',
        },
        address: {
            zonecode: 12345,
            roadAddress: '123 Main Street',
            bname: 'Mainville',
            buildingName: 'Smith Building',
            jibunAddress: 'Smith Building',
        },
        addressDetail: 'Floor 2',
        basketList: [
            { product: 'Product A', quantity: 2, price: 29.99 },
            { product: 'Product B', quantity: 1, price: 49.99 },
        ],
        orderList: [
            { orderID: '20231201-001', product: 'Product A', quantity: 2, price: 29.99 },
        ],
    }
]