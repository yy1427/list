// 全局变量
let currentWeekOffset = 0;
let todoList = [];
let doneList = [];
let nextweekList = [];

// 初始化
function init() {
    loadFromLocalStorage();
    updateWeekDisplay();
    renderTodoList();
    renderNextweekList();
    renderDoneList();
    bindEvents();
}

// 绑定事件
function bindEvents() {
    document.getElementById('addTodo').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    document.getElementById('addDone').addEventListener('click', addDone);
    document.getElementById('doneInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addDone();
    });
    document.getElementById('addNextweek').addEventListener('click', addNextweek);
    document.getElementById('nextweekInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNextweek();
    });
    document.getElementById('prevWeek').addEventListener('click', function() {
        currentWeekOffset--;
        updateWeekDisplay();
        loadFromLocalStorage();
        renderTodoList();
        renderNextweekList();
        renderDoneList();
    });
    document.getElementById('nextWeek').addEventListener('click', function() {
        currentWeekOffset++;
        updateWeekDisplay();
        loadFromLocalStorage();
        renderTodoList();
        renderNextweekList();
        renderDoneList();
    });
    document.getElementById('currentWeekBtn').addEventListener('click', function() {
        currentWeekOffset = 0;
        updateWeekDisplay();
        loadFromLocalStorage();
        renderTodoList();
        renderNextweekList();
        renderDoneList();
    });
    document.getElementById('generateReport').addEventListener('click', generateReport);
}

// 计算当前周的开始和结束日期
function getWeekDates(offset) {
    const today = new Date();
    const currentDay = today.getDay() || 7; // 将周日从0改为7
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + 1 + offset * 7); // 本周一
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // 本周五
    return { startDate, endDate };
}

// 更新周显示
function updateWeekDisplay() {
    const { startDate, endDate } = getWeekDates(currentWeekOffset);
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    document.getElementById('currentWeek').textContent = `${startStr} 至 ${endStr}`;
}

// 格式化日期为 YYYY年MM月DD日
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

// 添加待办事项
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (text) {
        const { startDate } = getWeekDates(currentWeekOffset);
        const weekKey = getWeekKey(startDate);
        const todo = {
            id: Date.now().toString(),
            text: text,
            createdAt: new Date().toISOString()
        };
        todoList.push(todo);
        saveToLocalStorage();
        renderTodoList();
        input.value = '';
    }
}

// 添加已完成事项
function addDone() {
    const input = document.getElementById('doneInput');
    const text = input.value.trim();
    if (text) {
        const { startDate } = getWeekDates(currentWeekOffset);
        const weekKey = getWeekKey(startDate);
        const todo = {
            id: Date.now().toString(),
            text: text,
            createdAt: new Date().toISOString()
        };
        doneList.push(todo);
        saveToLocalStorage();
        renderDoneList();
        input.value = '';
    }
}

// 添加下周计划
function addNextweek() {
    const input = document.getElementById('nextweekInput');
    const text = input.value.trim();
    if (text) {
        const { startDate } = getWeekDates(currentWeekOffset);
        const weekKey = getWeekKey(startDate);
        const todo = {
            id: Date.now().toString(),
            text: text,
            createdAt: new Date().toISOString()
        };
        nextweekList.push(todo);
        saveToLocalStorage();
        renderNextweekList();
        input.value = '';
    }
}

// 完成待办事项
function completeTodo(id) {
    const index = todoList.findIndex(todo => todo.id === id);
    if (index !== -1) {
        const todo = todoList.splice(index, 1)[0];
        doneList.push(todo);
        saveToLocalStorage();
        renderTodoList();
        renderDoneList();
    }
}

// 撤销已完成事项
function undoDone(id) {
    const index = doneList.findIndex(todo => todo.id === id);
    if (index !== -1) {
        const todo = doneList.splice(index, 1)[0];
        todoList.push(todo);
        saveToLocalStorage();
        renderTodoList();
        renderDoneList();
    }
}

// 删除待办事项
function deleteTodo(id) {
    todoList = todoList.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodoList();
}

// 删除已完成事项
function deleteDone(id) {
    doneList = doneList.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderDoneList();
}

// 删除下周计划
function deleteNextweek(id) {
    nextweekList = nextweekList.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderNextweekList();
}

// 渲染待办事项列表
function renderTodoList() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todoList.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button class="complete-btn" onclick="completeTodo('${todo.id}')">完成</button>
                <button class="delete-btn" onclick="deleteTodo('${todo.id}')">删除</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// 渲染已完成事项列表
function renderDoneList() {
    const list = document.getElementById('doneList');
    list.innerHTML = '';
    doneList.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button class="undo-btn" onclick="undoDone('${todo.id}')">撤销</button>
                <button class="delete-btn" onclick="deleteDone('${todo.id}')">删除</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// 渲染下周计划列表
function renderNextweekList() {
    const list = document.getElementById('nextweekList');
    list.innerHTML = '';
    nextweekList.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo.text}</span>
            <div>
                <button class="delete-btn" onclick="deleteNextweek('${todo.id}')">删除</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// 获取周的唯一键
function getWeekKey(date) {
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    return `${year}-W${weekNumber}`;
}

// 获取日期所在的周数
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// 保存到本地存储
function saveToLocalStorage() {
    const { startDate } = getWeekDates(currentWeekOffset);
    const weekKey = getWeekKey(startDate);
    const data = {
        todoList: todoList,
        doneList: doneList,
        nextweekList: nextweekList
    };
    localStorage.setItem(weekKey, JSON.stringify(data));
}

// 从本地存储加载
function loadFromLocalStorage() {
    const { startDate } = getWeekDates(currentWeekOffset);
    const weekKey = getWeekKey(startDate);
    const data = localStorage.getItem(weekKey);
    if (data) {
        const parsed = JSON.parse(data);
        todoList = parsed.todoList || [];
        doneList = parsed.doneList || [];
        nextweekList = parsed.nextweekList || [];
    } else {
        todoList = [];
        doneList = [];
        nextweekList = [];
    }
}

// 生成周报
function generateReport() {
    const { startDate, endDate } = getWeekDates(currentWeekOffset);
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    
    // 准备周报数据
    const reportData = {
        startDate: startStr,
        endDate: endStr,
        completedTasks: doneList.map((task, index) => `${index + 1}. ${task.text}`).join('\n'),
        todoTasks: nextweekList.map((task, index) => `${index + 1}. ${task.text}`).join('\n'),
        problems: ''
    };
    
    // 创建Word文档
    createWordDocument(reportData);
}

// 创建Word文档
function createWordDocument(data) {
    // 使用HTML表格格式创建Word文档内容
    const templateContent = `<div style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 10px;">华盛兴伟工作周报</div>

<div style="text-align: center; margin-bottom: 15px;">汇报人：________（${data.startDate}至${data.endDate}）</div>

<center>
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;" align="center">
    <tr>
        <td style="font-weight: bold; text-align: center;">本周工作完成情况</td>
        <td style="text-align: center;">${data.completedTasks.replace(/\n/g, '<br>')}</td>
    </tr>
    <tr>
        <td style="font-weight: bold; text-align: center;">下周工作计划</td>
        <td style="text-align: center;">${data.todoTasks.replace(/\n/g, '<br>')}</td>
    </tr>
    <tr>
        <td style="font-weight: bold; text-align: center;">问题及反思</td>
        <td style="text-align: center;">${data.problems}</td>
    </tr>
</table>
</center>

<div style="text-align: center; margin-top: 15px;">备注：一、本周工作完成情况填写（1）上周工作计划的执行结果（未能完成的要说明原因）、（2）本周工作、（3）主要参与人员、（4）与委托方沟通情况、（5）复核人员工作情况；<br> 二、每周六12:00前填写完毕，并粘贴在工作日志网络上；分管领导必须在17:00阅读并批注意见；调度必须在21:00对周报进行统计，于周日10:00通报。</div>`;
    
    // 创建Blob对象并下载
    const blob = new Blob([templateContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `周报_${data.startDate}_${data.endDate}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 初始化应用
init();
