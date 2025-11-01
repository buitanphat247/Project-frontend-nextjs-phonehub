/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 * @example
 * capitalizeFirst('admin') // returns 'Admin'
 * capitalizeFirst('hello world') // returns 'Hello world'
 */
export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize each word in a string
 * @param str - String to capitalize
 * @returns String with each word capitalized
 * @example
 * capitalizeWords('hello world') // returns 'Hello World'
 * capitalizeWords('admin user') // returns 'Admin User'
 */
export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

/**
 * Get color for HTTP status code
 * @param status - HTTP status code
 * @returns Color name for Ant Design Tag component
 * @example
 * getStatusColor(200) // returns 'success'
 * getStatusColor(404) // returns 'error'
 */
export function getStatusColor(status?: number): 'default' | 'success' | 'warning' | 'error' {
  if (!status) return 'default';
  if (status >= 200 && status < 300) return 'success';
  if (status >= 300 && status < 400) return 'warning';
  if (status >= 400) return 'error';
  return 'default';
}

