//triple integral of x*y*z optimization tests
use std::time::Instant;

fn main() {
    let start = Instant::now();
    original();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    code_motion();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    unrolling_2x1();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    unrolling_2x2();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    unrolling_4x1();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    unrolling_4x2();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    unrolling_4x2a();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    unrolling_8x8();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);
}

//original code with no optimization
fn original() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut result: f64 = 0.0;
    
    for i in 1..n {
        for j in 1..n {
            for k in 1..n {
                let x: f64 = a + (i as f64) * dx;
                let y: f64 = c + (j as f64) * dy;
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
        }
    }
    println!("{:#?}", result);
}

fn code_motion() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut result: f64 = 0.0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in 1..n {
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
        }
    }
    println!("{:#?}", result);
}

fn unrolling_2x1() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut result: f64 = 0.0;

    let mut k2: i32 = 0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in (1..n-1).step_by(2) {
                let z: f64 = e + (k as f64) * dz;
                let z2: f64 = e + ((k+1) as f64) * dz;
                result += (x * y * z) * dx * dy * dz + (x * y * z2) * dx * dy * dz;
                k2 = k;
            }
            for k in k2..n-1 {
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
        }
    }
    println!("{:#?}", result);
}

fn unrolling_2x2() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut r: f64 = 0.0;
    let mut r2: f64 = 0.0;
    let mut result: f64 = 0.0;

    let mut k2: i32 = 0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in (1..n-1).step_by(2) {
                let z: f64 = e + (k as f64) * dz;
                let z2: f64 = e + ((k+1) as f64) * dz;
                r += (x * y * z) * dx * dy * dz;
                r2 += (x * y * z2) * dx * dy * dz;
                k2 = k;
            }
            for k in k2..n-1 {
                let z: f64 = e + (k as f64) * dz;
                r += (x * y * z) * dx * dy * dz;
            }
            result = r + r2;
        }
    }
    println!("{:#?}", result);
}

fn unrolling_4x1() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut result: f64 = 0.0;

    let mut k2: i32 = 0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in (1..n-3).step_by(4) {
                let z: f64 = e + (k as f64) * dz;
                let z2: f64 = e + ((k+1) as f64) * dz;
                let z3: f64 = e + ((k+2) as f64) * dz;
                let z4: f64 = e + ((k+3) as f64) * dz;
                result += (x * y * z) * dx * dy * dz + (x * y * z2) * dx * dy * dz + multiply(x, y, z3) * dx * dy * dz + multiply(x, y, z4) * dx * dy * dz;
                k2 = k;
            }
            for k in k2..n-3 {
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
        }
    }
    println!("{:#?}", result);
}

fn unrolling_4x2() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut r: f64 = 0.0;
    let mut r2: f64 = 0.0;
    let mut result: f64 = 0.0;

    let mut k2: i32 = 0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in (1..n-3).step_by(4) {
                let z: f64 = e + (k as f64) * dz;
                let z2: f64 = e + ((k+1) as f64) * dz;
                let z3: f64 = e + ((k+2) as f64) * dz;
                let z4: f64 = e + ((k+3) as f64) * dz;
                r += (x * y * z) * dx * dy * dz + (x * y * z2) * dx * dy * dz;
                r2 += (x * y * z3) * dx * dy * dz + (x * y * z4) * dx * dy * dz;
                k2 = k;
            }
            for k in k2..n-3 {
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
            result = r + r2;
        }
    }
    println!("{:#?}", result);
}

fn unrolling_4x2a() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut r: f64 = 0.0;
    let mut r2: f64 = 0.0;
    let mut result: f64 = 0.0;

    let mut k2: i32 = 0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in (1..n-3).step_by(4) {
                let z: f64 = e + (k as f64) * dz;
                let z2: f64 = e + ((k+1) as f64) * dz;
                let z3: f64 = e + ((k+2) as f64) * dz;
                let z4: f64 = e + ((k+3) as f64) * dz;
                r = r + ((x * y * z) * dx * dy * dz + (x * y * z2) * dx * dy * dz);
                r2 = r2 + ((x * y * z3) * dx * dy * dz + (x * y * z4) * dx * dy * dz);
                k2 = k;
            }
            for k in k2..n-3 {
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
            result = r + r2;
        }
    }
    println!("{:#?}", result);
}

fn unrolling_8x8() {
    let a: f64 = 0.0; let b: f64 = 1.0; let c: f64 = 0.0; 
    let d: f64 = 1.0; let e: f64 = 0.0; let f: f64 = 1.0;
    let n: i32 = 1000;
    let dx: f64 = (b - a) / (n as f64); let dy: f64 = (d - c) / (n as f64); let dz: f64 = (f - e) / (n as f64);
    let mut r: f64 = 0.0;
    let mut r2: f64 = 0.0;
    let mut r3: f64 = 0.0;
    let mut r4: f64 = 0.0;
    let mut r5: f64 = 0.0;
    let mut r6: f64 = 0.0;
    let mut r7: f64 = 0.0;
    let mut r8: f64 = 0.0;
    let mut result: f64 = 0.0;

    let mut k2: i32 = 0;
    
    for i in 1..n {
        let x: f64 = a + (i as f64) * dx;
        for j in 1..n {
            let y: f64 = c + (j as f64) * dy;
            for k in (1..n-7).step_by(8) {
                let z: f64 = e + (k as f64) * dz;
                let z2: f64 = e + ((k+1) as f64) * dz;
                let z3: f64 = e + ((k+2) as f64) * dz;
                let z4: f64 = e + ((k+3) as f64) * dz;
                let z5: f64 = e + ((k+4) as f64) * dz;
                let z6: f64 = e + ((k+5) as f64) * dz;
                let z7: f64 = e + ((k+6) as f64) * dz;
                let z8: f64 = e + ((k+7) as f64) * dz;
                r += (x * y * z) * dx * dy * dz;
                r2 += (x * y * z2) * dx * dy * dz;
                r3 += (x * y * z3) * dx * dy * dz;
                r4 += (x * y * z4) * dx * dy * dz;
                r5 += (x * y * z5) * dx * dy * dz;
                r6 += (x * y * z6) * dx * dy * dz;
                r7 += (x * y * z7) * dx * dy * dz;
                r8 += (x * y * z8) * dx * dy * dz;
                k2 = k;
            }
            for k in k2..n-7 {
                let z: f64 = e + (k as f64) * dz;
                result += (x * y * z) * dx * dy * dz;
            }
            result = r + r2 + r3 + r4 + r5 + r6 + r7 + r8;
        }
    }
    println!("{:#?}", result);
}

fn multiply(x: f64, y: f64, z: f64) -> f64 {
    x * y * z
}
