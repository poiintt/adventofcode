use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    let mut left_vec: Vec<i32> = Vec::new();
    let mut right_vec: Vec<i32> = Vec::new();

    if let Ok(lines) = read_lines("./puzzle.txt") {
        for line in lines.flatten() {
            let parts = line.split("   ").collect::<Vec<&str>>();
            let left: i32 = parts[0].parse().expect("expected number");
            let right: i32 = parts[1].parse().expect("expected number");
            left_vec.push(left);
            right_vec.push(right);
        }
    }
    left_vec.sort();
    right_vec.sort();

    let mut distances: Vec<i32> = Vec::new();
    for i in 0..left_vec.len() {
        let left = left_vec[i];
        let right = right_vec[i];
        if left > right {
            distances.push(left - right);
        } else {
            distances.push(right - left);
        }
    }

    let result: i32 = distances.iter().sum();

    println!("{:?}", result);
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
