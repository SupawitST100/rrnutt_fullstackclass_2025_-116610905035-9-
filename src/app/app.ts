import { Component } from '@angular/core';
// 1. นำเข้า RouterOutlet และ RouterLink จาก @angular/router
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root', // ของคุณอาจจะเป็น app-root หรือชื่ออื่น ปล่อยไว้อย่างเดิมได้ครับ
  // 2. เอาชื่อที่นำเข้ามา ใส่ลงไปในช่อง imports: [] แบบนี้ครับ 👇
  imports: [RouterOutlet, RouterLink], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { // ชื่อคลาสของคุณอาจจะเป็น App เฉยๆ หรือ AppComponent
  title = 'travel-booking';
}