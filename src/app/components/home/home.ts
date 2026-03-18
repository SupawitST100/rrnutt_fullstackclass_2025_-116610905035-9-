import { Component } from '@angular/core';
// 1. นำเข้า RouterLink
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-home',
  imports: [RouterLink], // 2. ใส่ RouterLink ลงในวงเล็บก้ามปูตรงนี้
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home { // ชื่อคลาสของคุณอาจจะเป็น Home หรือ HomeComponent

}