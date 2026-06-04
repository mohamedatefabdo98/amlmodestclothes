const PRODUCTS = {
  winter: [
    {id:'w3', name:'دريس شتوي رباط',       price:950, imgId:'1ncpV11mmkb-CqI7-YasiVyN9FPLXKEKf', badge:'شتوي'},
    {id:'w2', name:'دريس شتوي مضفر',        price:850, imgId:'18uZv8R-CWFb7CZRCH1s5o1NSfJoTs_y5', badge:'شتوي'},
    {id:'w4', name:'سوت شتوي مضلع',         price:800, imgId:'1OTfxp3EPxrdF3AN1jB0e8J-Uvh-sepXx', badge:'شتوي'},
    {id:'w1', name:'دريس شتوي مضلع',        price:800, imgId:'1BxOx1WXD2XCl48aIsWG7SjUIFDlzrbWc', badge:'شتوي'},
    {id:'w5', name:'كوت جوخ',               price:950, imgId:'1am8tdNZFT8cfnMMgAUQ4uWHQW7BM3tIB', badge:'شتوي'},
  ],
  summer: [
    {id:'s7', name:'شيرت دريس',             price:800, imgId:'1gzjSp3XtQ7Fd7rjSmIlFj_j1baEHTLC8', badge:'صيفي'},
    {id:'s4', name:'دريس صيفي رباط',        price:750, imgId:'1K29kAQCUHogP0hayf4SX_5U2390Y1mDA', badge:'صيفي'},
    {id:'s3', name:'دريس اوفر سايز',        price:750, imgId:'1sK-aceMfrSOA8begRPl2f6Ri4cQao9Eh', badge:'صيفي'},
    {id:'s2', name:'دريس بيليسيه رباط',     price:800, imgId:'1rZ0itEnXQfNG1thtEcz6OMHfoSr3UZzP', badge:'صيفي'},
    {id:'s1', name:'الكاردي العباية',        price:800, imgId:'185ERyxzBeMAYR96yoQ_Ay8L1YPDuOSI-', badge:'صيفي'},
    {id:'s5', name:'سوت صيفي (شميز-اسكيرت)',price:800, imgId:'1rYtBKTeH2pSSDMbbQbDscQCmaNgQkd0P', badge:'صيفي'},
    {id:'s6', name:'شميز دريس صيفي',        price:750, imgId:'1Qd6AxIXzylZCL7xvjtI3fEFRgv2yDISL', badge:'صيفي'},
    {id:'s8', name:'لونج كيمونو',           price:750, imgId:'1fMlYWzxZAaafMKcDf5VlVXVGTKyIzQxW', badge:'صيفي'},
    {id:'s9', name:'ميني كيمونو',           price:700, imgId:'1IwLTK9H4Kui8sHhkvvVpvx7vxx73_6H3', badge:'صيفي'},
  ]
};

function imgUrl(id, sz='w600') {
  return 'https://drive.google.com/thumbnail?id=' + id + '&sz=' + sz;
}

function getAllProducts() {
  return [...PRODUCTS.winter, ...PRODUCTS.summer];
}

function getProductById(pid) {
  return getAllProducts().find(p => p.id === pid) || null;
}
