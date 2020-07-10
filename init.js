const process = require('process');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const temp = 'temp';
const copy_list = ['node_modules', 'package.json', 'package-lock.json'];
mkdir(temp);
runcmd('hexo init', temp);
for (let v of copy_list) {
	copy(path.join(temp, v), path.join('.', v));
}
rm(temp);
/**
 * 等号内用于初始化插件，可自行添加。等号外内容慎动
 * ==================================================
 */
runcmd('npm install hexo-deployer-git --save');
runcmd('npm install hexo-uuid --save');
/**
 * ==================================================
 */

/**
 * 获取命令行参数
 * @param index {number} 参数索引
 * @returns arg {string} 参数
 */
function arg(index) {
	return process.argv[2 + index];
}

/**
 * 运行命令行
 * @param cmd {string} 命令行
 * @param cwd {string} 工作路径
 */
function runcmd(cmd, cwd) {
	console.log(`cmd: ${cmd}; cwd: ${cwd}`);
	execSync(cmd, { stdio: 'inherit', cwd });
}

/**
 * 递归创建目录
 * @param dest_path {string} 操作路径
 */
function mkdir(dest_path) {
	if (!fs.existsSync(dest_path)) {
		mkdir(path.dirname(dest_path));
		fs.mkdirSync(dest_path);
		console.log(`mkdir: ${dest_path}`);
	}
}

/**
 * 递归删除
 * @param dest_path {string} 操作路径
 */
function rm(dest_path) {
	if (!fs.existsSync(dest_path)) {
		console.log('rm: path not found');
		return;
	}
	if (fs.statSync(dest_path).isDirectory()) {
		let files = fs.readdirSync(dest_path);
		for (let file of files) {
			let next_path = path.join(dest_path, file);
			rm(next_path);
		}
		fs.rmdirSync(dest_path);
	} else {
		fs.unlinkSync(dest_path);
	}
	console.log(`rm: ${dest_path}`);
}

/**
 * 递归复制
 * @param src_path {string} 源路径
 * @param dest_path {string} 操作路径
 */
function copy(src_path, dest_path) {
	if (fs.statSync(src_path).isDirectory()) {
		mkdir(dest_path);
		let files = fs.readdirSync(src_path);
		for (let file of files) {
			let next_src = path.join(src_path, file);
			let next_dest = path.join(dest_path, file);
			copy(next_src, next_dest);
		}
	} else {
		mkdir(path.dirname(dest_path));
		fs.copyFileSync(src_path, dest_path);
		console.log(`copy: ${src_path} => ${dest_path}`);
	}
}