//triple integral optimization tests

fn main() {
    let a = 0; let b = 1; let c = 0; let d = 1; let e = 0; let f = 1;
    let n = 10;
    let dx = (b - a) / n; let dy = (d - c) / n; let dz = (f - e) / n;
    let mut result = 0;
    
    for i in 1..n {
        let x = a + i * dx;
        for j in 1..n {
            let y = c + j * dy;
            for k in 1..n {
                let z = e + k * dz;
                result += multiply(x, y, z) * dx * dy * dz;
            }
        }
    }
    println!("{:?}", result);
}

fn multiply(x: i32, y: i32, z: i32) -> i32 {
    x * y * z
}
