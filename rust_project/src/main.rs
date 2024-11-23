//triple integral optimization tests
use std::time::Instant;

fn main() {
    let start = Instant::now();
    original();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}\n", duration);

    let start = Instant::now();
    code_motion();
    let duration = start.elapsed();
    println!("Elapsed time: {:#?}", duration);
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
                result += multiply(x, y, z) * dx * dy * dz;
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
                result += multiply(x, y, z) * dx * dy * dz;
            }
        }
    }
    println!("{:#?}", result);
}

fn multiply(x: f64, y: f64, z: f64) -> f64 {
    x * y * z
}
